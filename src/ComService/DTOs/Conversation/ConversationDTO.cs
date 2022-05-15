using ComService.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.DTOs.Conversation
{
    public class ConversationDTO
    {
        public string Id { get;  set; }
        public string Name { get;  set; }

        public ConversationTypeEnum Type { get;  set; }
        public List<ConversationMember> Members { get;  set; }
        public IList<Message> Messages { get;  set; }
        public DateTime UpdatedDate { get; set; }

        public static ConversationDTO From(ComService.Domain.Conversation conversation)
        {
            return new ConversationDTO()
            {
                Id = conversation.Id,
                Name = conversation.Name,
                Type = conversation.Type,
                Members = conversation.Members,
                Messages = conversation.RecentMessages,
                UpdatedDate = conversation.UpdatedDate
            };
        }
    }
}
