﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Domain
{
    public class Channel : Conversation
    {
        private Channel() { }
        public Channel(string id,
            string name,
            IList<string> allowedEventTypeCodes) 
            :base(id, name,ConversationTypeEnum.Channel)
        {
            ChannelLevel = 0;
            RecentEvents = new List<ChannelEvent>();
            this.UpdateAllowedEventTypeCodes(allowedEventTypeCodes);
        }
        public int ChannelLevel { get; set; }
        public string? ParentId { get; set; }
        public string AncestorIds { get;  set; }

        public IList<ChannelEventType> AllowedEventTypes { get; private set; }

        public List<ChannelEvent> RecentEvents { get; private set; }

        public void SetName(string name)
        {
            Name = name;
        }

        public void UpdateAllowedEventTypeCodes(IList<string> eventTypeCodes)
        {
            AllowedEventTypes = eventTypeCodes.Select(code =>
            {
                return new ChannelEventType()
                {
                    EventTypeCode = code
                };
            }).ToList();
        }

    }

    public class ChannelEvent
    {
        public string ChannelId { get; set; }
        public string EventId { get; set; }
        public Event Event { get; set; }
    }

    public class ChannelEventType
    {
        public string ChannelId { get; set; }
        public string EventTypeCode { get; set; }
        public EventType EventType { get; set; }
    }

}
