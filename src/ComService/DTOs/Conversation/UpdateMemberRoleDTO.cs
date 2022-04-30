using ComService.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.DTOs.Conversation
{
    public class UpdateMemberRoleDTO
    {
        public string ConversationId { get; set; }
        public string UserMemberId { get; set; }

        public MemberRoleEnum Role { get; set; }
    }
}
