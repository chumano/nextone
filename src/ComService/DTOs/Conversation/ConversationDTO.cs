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
        public string CreatedBy { get; set; }

        public static ConversationDTO From(ComService.Domain.Conversation conversation)
        {
            var offlineDate = DateTime.Now.AddMinutes(-15);
            return new ConversationDTO()
            {
                Id = conversation.Id,
                Name = conversation.Name,
                Type = conversation.Type,
                Members = conversation.Members.Select(o =>
                {
                    if (o.UserMember.LastUpdateDate != null && o.UserMember.LastUpdateDate < offlineDate)
                    {
                        o.UserMember.Status = StatusEnum.Offline;
                    }
                    return o;
                }).ToList(),
                Messages = conversation.RecentMessages,
                UpdatedDate = conversation.UpdatedDate,
                CreatedBy = conversation.CreatedBy,
            };
        }
    }
}
