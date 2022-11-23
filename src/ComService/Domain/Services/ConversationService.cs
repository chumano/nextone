using ComService.Domain.DomainEvents;
using ComService.Domain.Repositories;
using ComService.Infrastructure;
using Microsoft.EntityFrameworkCore;
using NextOne.Shared.Bus;
using NextOne.Shared.Common;
using NextOne.Shared.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Domain.Services
{
    public interface IConversationService
    {
        Task<IEnumerable<Conversation>> GetConversationsByUser(UserStatus user, PageOptions pageOptions, bool isExcludeChannel);
        Task<Conversation> Get(string id);
        Task<string> Create(UserStatus createdUser, string name, ConversationTypeEnum type, IList<string> memberIds);
        Task Delete(Conversation conversation);

        //message
        Task AddMessage(Conversation conversation, Message message);
        Task<Message> GetMessageById(string messageId);
        Task<IEnumerable<Message>> GetMessagesHistory(Conversation conversation, DateTime beforeDate, PageOptions pageOptions);
        Task<IEnumerable<Message>> GetMessagesNearBy(Conversation conversation, string messageId, int prevNum = 10, int nextNum = 10);

        //members
        Task<List<ConversationMember>> AddMembers(Conversation conversation, List<string> memberIds);
        Task UpdateMemberRole(Conversation conversation, UserStatus user, MemberRoleEnum role);
        Task RemoveMember(Conversation conversation, UserStatus user);

        Task UpdateUserSeen(Conversation conversation, string userId);
    }

    public class ConversationService : IConversationService
    {
        protected readonly IConversationRepository _conversationRepository;
        protected readonly IMessageRepository _messageRepository;
        protected readonly IUserStatusService _userService;
        protected readonly IdGenerator _idGenerator;
        protected readonly ComDbContext _dbContext;
        protected readonly IBus _bus;
        public ConversationService(
            IConversationRepository conversationRepository,
            IMessageRepository messageRepository,
            IUserStatusService userService,
            ComDbContext comDbContext,
            IBus bus, IdGenerator idGenerator)
        {
            _conversationRepository = conversationRepository;
            _messageRepository = messageRepository;
            _userService = userService;
            _bus = bus;
            _idGenerator = idGenerator;
            _dbContext = comDbContext;
        }

        public async Task<string> Create(UserStatus createdUser, string name, ConversationTypeEnum type, IList<string> memberIds)
        {
            var id = _idGenerator.GenerateNew();
            Conversation conversation = new P2PConversation(id, name, type);
            if (type == ConversationTypeEnum.Peer2Peer
                || type == ConversationTypeEnum.Private
                || type == ConversationTypeEnum.Group)
            {
                if (!memberIds.Contains(createdUser.UserId))
                {
                    memberIds.Add(createdUser.UserId);
                }
            }

            if (type == ConversationTypeEnum.Peer2Peer)
            {
                if (memberIds.Count != 2)
                {
                    throw new DomainException("", "Phải có 2 người dùng");
                }

                //check conversation exist
                var existConversation = await GetP2PConversation(memberIds[0], memberIds[1]);
                if (existConversation != null)
                {
                    return existConversation.Id;
                }
            }

            //get users
            var users = await _userService.GetOrAddUsersByIds(memberIds);

            foreach (var user in users)
            {
                var role = MemberRoleEnum.MEMBER;
                if (user.UserId == createdUser.UserId &&
                       (type == ConversationTypeEnum.Group || type == ConversationTypeEnum.Channel))
                {
                    role = MemberRoleEnum.MANAGER;
                }

                conversation.AddMember(new ConversationMember()
                {
                    UserId = user.UserId,
                    Role = role
                });
            }

            _conversationRepository.Add(conversation);

            await _conversationRepository.SaveChangesAsync();

            //TODO: send ConversationCreated
            await _bus.Publish(new ConversationCreated());

            return conversation.Id;
        }

        public Task<Conversation> Get(string id)
        {
            return _conversationRepository.Get(id);
        }

        public Task<Conversation> GetP2PConversation(string userId1, string userId2)
        {
            return _conversationRepository.Conversations
                .Where(o => o.Type == ConversationTypeEnum.Peer2Peer)
                .Where(o => (
                    o.Members.Any(o => o.UserId == userId1)
                    && o.Members.Any(o => o.UserId == userId2))
                )
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Conversation>> GetConversationsByUser(UserStatus user, PageOptions pageOptions, bool isExcludeChannel)
        {
            var query = _conversationRepository.Conversations.AsNoTracking();
            if (isExcludeChannel)
            {
                query = query.Where(o => o.Type != ConversationTypeEnum.Channel);
            }
            else
            {
                query = query
                   .Include(o => o.RecentMessages)
                        .ThenInclude(m => m.Event)
                            .ThenInclude(o => o.EventType)
                   .Include(o => o.RecentMessages)
                        .ThenInclude(o => o.Event)
                            .ThenInclude(o => o.Files)
                   .Include(o => o.RecentMessages)
                        .ThenInclude(o => o.Event)
                            .ThenInclude(o => o.UserSender);
                //query = query.OfType<Channel>()
                //    .Include(o => o.RecentEvents)
                //    .ThenInclude(o => o.Event)
                //        .ThenInclude(o => o.EventType);
            }
                
            var items = await query
                .Where(o => o.Members.Any(m => m.UserId == user.UserId))
                .OrderByDescending(o => o.UpdatedDate)
                .Skip(pageOptions.Offset)
                .Take(pageOptions.PageSize)
                .ToListAsync();

            return items;
        }

        public async Task Delete(Conversation conversation)
        {
            _conversationRepository.Delete(conversation);

            await _conversationRepository.SaveChangesAsync();
            // TODO: send ConvesationDeleted
            await _bus.Publish(new ConversationDeleted());
        }

        //member
        public async Task<List<ConversationMember>> AddMembers(Conversation conversation, List<string> memberIds)
        {
            var users = await _userService.GetOrAddUsersByIds(memberIds);
            var newMembers = new List<ConversationMember>();
            foreach (var user in users)
            {
                var role = MemberRoleEnum.MEMBER;
                var member = new ConversationMember()
                {
                    UserId = user.UserId,
                    Role = role
                };
                conversation.AddMember(member);
                newMembers.Add(member);
            }

            //Nếu đây là channel  
            if(conversation.Type == ConversationTypeEnum.Channel)
            {
                //thêm thành viên mới vào các kênh con
                var subchannels = await _dbContext.Channels
                    .Include(o => o.Members)
                    .Where(o => o.AncestorIds != null
                                && o.AncestorIds.Contains(conversation.Id))
                    .ToListAsync();

                foreach (var subchannel in subchannels)
                {
                    foreach(var newMember in newMembers)
                    {
                        if(!subchannel.Members.Any(o=> o.UserId == newMember.UserId))
                        {
                            subchannel.Members.Add(new ConversationMember()
                            {
                                UserId = newMember.UserId,
                                Role = MemberRoleEnum.PARENT
                            });
                        }
                    }
                }
            }

            await _conversationRepository.SaveChangesAsync();

            // TODO: send ConversationMemberAdded
            await _bus.Publish(new ConversationMembersAdded());
            return newMembers;
        }

        public async Task UpdateMemberRole(Conversation conversation, UserStatus user, MemberRoleEnum role)
        {
            conversation.UpdateMemberRole(user, role);

            await _conversationRepository.SaveChangesAsync();

            // TODO: send ConversationMemberRoleUpdated
            await _bus.Publish(new ConversationMemberRoleUpdated());
        }

        public async Task RemoveMember(Conversation conversation, UserStatus user)
        {
            conversation.RemoveMember(user);

            //Nếu đây là channel, xóa member ở các kênh con
            if (conversation.Type == ConversationTypeEnum.Channel)
            {
                var subchannels = await _dbContext.Channels
                   .Include(o => o.Members)
                   .Where(o => o.AncestorIds != null
                               && o.AncestorIds.Contains(conversation.Id))
                   .ToListAsync();
                foreach (var subchannel in subchannels)
                {
                    //Remove if exist
                    subchannel.RemoveMember(user);
                }
            }

            await _conversationRepository.SaveChangesAsync();

            // TODO: send ConversationMemberDeleted
            await _bus.Publish(new ConversationMemberDeleted());
        }


        public async Task UpdateUserSeen(Conversation conversation, string userId)
        {
            var member = conversation.Members.Find(o => o.UserId == userId);
            if (member == null) return;

            member.SeenDate = DateTime.Now;
            await _conversationRepository.SaveChangesAsync();

            // TODO: send ConversationMemberSeen
            await _bus.Publish(new ConversationMemberSeen(conversation, userId));
        }

        //message
        public async Task AddMessage(Conversation conversation, Message message)
        {
            _messageRepository.Add(message);
            conversation.RecentMessages.Add(message);

            conversation.UpdatedDate = DateTime.Now;

            await _messageRepository.SaveChangesAsync();

            //send ConversationMessageAdded
            await _bus.Publish(new ConversationMessageAdded()
            {
                Conversation = conversation,
                Message = message
            });
        }

        public Task<Message> GetMessageById(string messageId)
        {
            return _messageRepository.Messages.FirstOrDefaultAsync(o => o.Id == messageId);
        }

        public async Task<IEnumerable<Message>> GetMessagesNearBy(Conversation conversation, string messageId, int prevNum = 10, int nextNum = 10)
        {
            var message = await _messageRepository.Messages.FirstOrDefaultAsync(o => o.Id == messageId);

            var prevMessages = _messageRepository.Messages
                                .Where(o => o.SentDate <= message.SentDate && o.Id != message.Id)
                                .OrderByDescending(o => o.SentDate)

                                .Take(prevNum);
            var nextMessages = _messageRepository.Messages
                                .OrderByDescending(o => o.SentDate)
                                .Where(o => o.SentDate >= message.SentDate && o.Id != message.Id)
                                .Take(nextNum);

            return await nextMessages.Union(prevMessages).ToListAsync();
        }

        public async Task<IEnumerable<Message>> GetMessagesHistory(Conversation conversation, DateTime beforeDate, PageOptions pageOptions)
        {
            var query = _messageRepository.Messages
                               .Where(o => o.ConversationId == conversation.Id
                                        && o.SentDate < beforeDate)
                               .OrderByDescending(o => o.SentDate)
                               .Skip(pageOptions.Offset)
                               .Take(pageOptions.PageSize);

            return await query.ToListAsync();
        }

    }
}
