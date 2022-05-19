using ComService.Domain.DomainEvents;
using ComService.Domain.Repositories;
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
        Task<IEnumerable<Channel>> GetChannelsByUser(UserStatus user, PageOptions pageOptions);
        new Task<Channel> Get(string id);
        Task<string> Create(UserStatus createdUser, string name,  IList<string> memberIds, IList<string> eventTypeCodes);
        Task UpdateEventTypes(Channel channel, string name,
            IList<string> eventTypeCodes);
        Task AddEvent(Channel channel, Event evt);
        Task<IEnumerable<Channel>> GetChannelsByEventCode(string evtCode);

        Task<IEnumerable<Event>> GetEventsHistory(Channel conversation, DateTime beforeDate, PageOptions pageOptions);
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
           IUserStatusService userService,
           IBus bus, IdGenerator idGenerator)
            :base(conversationRepository, messageRepository, userService, bus, idGenerator)
        {
            _channelRepository = channelRepository;
            _eventRepository = eventRepository;
        }

        public async Task<IEnumerable<Channel>> GetChannelsByUser(UserStatus user, PageOptions pageOptions)
        {
            var items = await _channelRepository.Channels
                .Where(o => o.Members.Any(m => m.UserId == user.UserId))
                .OrderByDescending(o => o.UpdatedDate)
                .Skip(pageOptions.Offset)
                .Take(pageOptions.PageSize)
                .ToListAsync();

            return items;
        }

        public async Task<string> Create(UserStatus createdUser, string name, 
            IList<string> memberIds, 
            IList<string> eventTypeCodes)
        {
            var id = _idGenerator.GenerateNew();
            var type = ConversationTypeEnum.Channel;
            var channel = new Channel(id, name, eventTypeCodes);

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
            _eventRepository.Add(evt);
            //TODO add message to Conversation Channel
            var messageId = _idGenerator.GenerateNew();
            var message = new Message(messageId, MessageTypeEnum.Event,
                evt.UserSenderId, evt);
            _messageRepository.Add(message);

            channel.UpdatedDate = DateTime.Now;
            await _eventRepository.SaveChangesAsync();

            // TODO: send ChannelEventAdded
            await _bus.Publish(new ChannelEventAdded());
            await _bus.Publish(new ConversationMessageAdded());
        }

        public async Task<IEnumerable<Channel>> GetChannelsByEventCode(string evtCode)
        {
            var items1 = await _channelRepository.Channels
                    .Where(o => o.AllowedEventTypeCodes.Contains(evtCode))
                    .ToListAsync();
            var items = await _conversationRepository.Conversations
                 .OfType<Channel>()
                 .Where(o => o.AllowedEventTypeCodes.Contains(evtCode))
                 .ToListAsync();
            return items;
        }

        public async Task<IEnumerable<Event>> GetEventsHistory(Channel channel, DateTime beforeDate, PageOptions pageOptions)
        {
            var query = _eventRepository.Events
                              .Where(o => o.ChannelId == channel.Id
                                       && o.OccurDate < beforeDate)
                              .OrderByDescending(o => o.OccurDate)
                              .Skip(pageOptions.Offset)
                              .Take(pageOptions.PageSize);

            return await query.ToListAsync();
        }

     
    }
}
