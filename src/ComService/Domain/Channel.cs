using System;
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
            RecentEvents = new List<Event>();
            this.UpdateAllowedEventTypeCodes(allowedEventTypeCodes);
        }

        public IList<ChannelEventType> AllowedEventTypes { get; private set; }

        public List<Event> RecentEvents { get; private set; }

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

    public class ChannelEventType
    {
        public string ChannelId { get; set; }
        public string EventTypeCode { get; set; }
        public EventType EventType { get; set; }
    }

}
