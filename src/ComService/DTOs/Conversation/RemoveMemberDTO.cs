using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.DTOs.Conversation
{
    public class RemoveMemberDTO
    {
        public string ConversationId { get; set; }
        public string UserMemberId { get; set; }
    }
}
