using ComService.Domain.DomainEvents;
using ComService.Domain.Repositories;
using ComService.Infrastructure;
using Microsoft.EntityFrameworkCore;
using NextOne.Shared.Bus;
using NextOne.Shared.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Domain.Services
{
    public interface IChannelService : IConversationService
    {
        Task<IEnumerable<Channel>> GetChannelsByUser(UserStatus user, PageOptions pageOptions, bool isAdmin = false);
        new Task<Channel> Get(string id);
        Task<string> Create(UserStatus createdUser, string name,  IList<string> memberIds, IList<string> eventTypeCodes, string parentChannelId = null);
        Task UpdateEventTypes(Channel channel, string name,
            IList<string> eventTypeCodes);
        Task AddEvent(Channel channel, Event evt);
        Task<IEnumerable<Channel>> GetChannelsByEventCode(string evtCode);

        Task<IEnumerable<Event>> GetEventsHistory(Channel conversation, DateTime? beforeDate, PageOptions pageOptions);
    }
    public class ChannelService : ConversationService, IChannelService
    {
        private readonly IChannelRepository _channelRepository;
        private readonly IEventRepository _eventRepository;
        public ChannelService(
           IChannelRepository channelRepository,
           IConversationRepository conversationRepository,
           IMessageRepository messageRepository,
           IEventRepository eventRepository,
           IUserStatusService userService, ComDbContext comDbContext,
           IBus bus, IdGenerator idGenerator)
            :base(conversationRepository, messageRepository, userService, comDbContext, bus, idGenerator)
        {
            _channelRepository = channelRepository;
            _eventRepository = eventRepository;
        }

        public async Task<IEnumerable<Channel>> GetChannelsByUser(UserStatus user, PageOptions pageOptions, bool isAdmin = false)
        {
            var query = _channelRepository.Channels;
            if (!isAdmin)
            {
                query = query.Where(o => o.Members.Any(m => m.UserId == user.UserId));
            }

            var items = await query
                .OrderByDescending(o => o.UpdatedDate)
                .Skip(pageOptions.Offset)
                .Take(pageOptions.PageSize)
                .ToListAsync();

            return items;
        }

        public async Task<string> Create(UserStatus createdUser, string name, 
            IList<string> memberIds, 
            IList<string> eventTypeCodes, string parentChannelId = null)
        {
            Channel parentChannel = null;

            if (!string.IsNullOrEmpty(parentChannelId))
            {
                parentChannel = await _channelRepository.Get(parentChannelId);
                if (parentChannel == null)
                {
                    throw new Exception($"Không tồn tại kênh {parentChannelId}");
                }

                eventTypeCodes = parentChannel.AllowedEventTypes
                    .Select(o=>o.EventTypeCode).ToList();
            }
                var id = _idGenerator.GenerateNew();
            var type = ConversationTypeEnum.Channel;
            var channel = new Channel(id, name, eventTypeCodes);
            channel.CreatedBy = createdUser.UserId;

            if (!memberIds.Contains(createdUser.UserId))
            {
                memberIds.Add(createdUser.UserId);
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

                channel.AddMember(new ConversationMember()
                {
                    UserId = user.UserId,
                    Role = role
                });
            }

            //check parent channel
            if (parentChannel != null)
            {
                var parentLevel = parentChannel.ChannelLevel;
                var channelLevel = parentLevel + 1;
                var ancestorIds = parentChannel.AncestorIds?? "";
                if (channelLevel > 2)
                {
                    throw new Exception($"Không thể tạo kênh con quá 3 cấp");
                }
                ancestorIds +=(","+ parentChannelId + ",");
                channel.ChannelLevel = channelLevel;
                channel.ParentId = parentChannelId;
                channel.AncestorIds = ancestorIds;

                //add members của parent vào con
                foreach (var member in parentChannel.Members)
                {
                    if (!memberIds.Contains(member.UserId))
                    {
                        channel.AddMember(new ConversationMember()
                        {
                            UserId = member.UserId,
                            Role = MemberRoleEnum.PARENT
                        });
                    }
                }
            }
            
            

            _channelRepository.Add(channel);

            await _channelRepository.SaveChangesAsync();

            //TODO: send Channel ConversationCreated
            await _bus.Publish(new ConversationCreated());

            return channel.Id;
        }

        public async Task UpdateEventTypes(Channel channel, string name,
            IList<string> eventTypeCodes)
        {
            channel.SetName(name);
            channel.UpdateAllowedEventTypeCodes(eventTypeCodes);

            await _channelRepository.SaveChangesAsync();

            // TODO: send ChannelUpdateEventTypesUpdated
            await _bus.Publish(new ChannelUpdateEventTypesUpdated());
        }

        public new Task<Channel> Get(string id)
        {
            return _channelRepository.Get(id);
        }

        public async Task AddEvent(Channel channel, Event evt)
        {
            channel.RecentEvents.Add(new ChannelEvent()
            {
                EventId = evt.Id,
                Event = evt
            });


            var messageId = _idGenerator.GenerateNew();
            var message = new Message(messageId, MessageTypeEnum.Event,
                evt.UserSenderId, evt);

            _messageRepository.Add(message);
            channel.RecentMessages.Add(message);


            channel.UpdatedDate = DateTime.Now;

            await _messageRepository.SaveChangesAsync();
            // TODO: send ChannelEventAdded
            await _bus.Publish(new ChannelEventAdded());
            await _bus.Publish(new ConversationMessageAdded()
            {
                Conversation = channel,
                Message = message
            });
        }

        public async Task<IEnumerable<Channel>> GetChannelsByEventCode(string evtCode)
        {
            var items = await _channelRepository.Channels
                    .Where(o => o.AllowedEventTypes.Any(t => t.EventTypeCode == evtCode))
                    .ToListAsync();
            //var items = await _conversationRepository.Conversations
            //     .OfType<Channel>()
            //       .Where(o => o.AllowedEventTypes.Any(t => t.EventTypeCode == evtCode))
            //        .ToListAsync();
            return items;
        }

        public async Task<IEnumerable<Event>> GetEventsHistory(Channel channel, DateTime? beforeDate, PageOptions pageOptions)
        {
            var query = _channelRepository.Channels.AsNoTracking()
                    .Where(o => o.Id == channel.Id)
                    .Include(o => o.RecentEvents)
                        .ThenInclude(o => o.Event)
                    .SelectMany(o => o.RecentEvents)
                    .Select(o => o.Event);
            if (beforeDate.HasValue)
            {
                query = query.Where(o => o.OccurDate < beforeDate);
            }

            query = query.OrderByDescending(o => o.OccurDate)
                              .Skip(pageOptions.Offset)
                              .Take(pageOptions.PageSize);

            return await query.ToListAsync();
        }

     
    }
}
