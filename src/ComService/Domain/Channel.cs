using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Domain
{
    public class Channel : Conversation
    {
        public Channel():base(ConversationTypeEnum.Channel)
        {

        }

        public IList<string> AllowedEventTypeCodes { get; set; }
        public List<Event> RecentEvents { get; set; }
    }

}
