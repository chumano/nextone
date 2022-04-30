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
            AllowedEventTypeCodes = allowedEventTypeCodes;
            RecentEvents = new List<Event>();
        }

        public IList<string> AllowedEventTypeCodes { get; private set; }
        public List<Event> RecentEvents { get; private set; }
    }

}
