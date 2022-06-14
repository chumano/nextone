using ComService.Domain;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ComService.DTOs.Channel
{
    public class ChannelDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }

        public ConversationTypeEnum Type { get; set; }
        public List<ConversationMember> Members { get; set; }
        public IList<Message> Messages { get; set; }
        public IList<Domain.Event> Events { get; set; }
        public DateTime UpdatedDate { get; set; }
        public IList<EventType> AllowedEventTypes { get; set; }
        public string CreatedBy { get; set; }

        public static ChannelDTO From(Domain.Channel channel)
        {
            var eventTypes = new List<EventType>();
            if (channel.AllowedEventTypes != null)
            {
                eventTypes = channel.AllowedEventTypes
                .Select(t => t.EventType)
                .ToList();
            }

            var events = channel.RecentEvents.Select(o => o.Event).ToList();
            var offlineDate = DateTime.Now.AddMinutes(-15);

            return new ChannelDTO()
            {
                Id = channel.Id,
                Name = channel.Name,
                Type = channel.Type,
                Members = channel.Members.Select(o =>
                {   
                    if(o.UserMember.LastUpdateDate!=null && o.UserMember.LastUpdateDate < offlineDate)
                    {
                        o.UserMember.Status = StatusEnum.Offline;
                    }
                    return o;
                }).ToList(),
                Messages = channel.RecentMessages,
                UpdatedDate = channel.UpdatedDate,
                AllowedEventTypes = eventTypes,
                Events = events,
                CreatedBy = channel.CreatedBy,
            };
        }
    }
}
