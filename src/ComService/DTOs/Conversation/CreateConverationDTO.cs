using ComService.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.DTOs.Conversation
{
    public class CreateConverationDTO
    {
        public string Name { get; set; }
        public ConversationTypeEnum Type { get; set; }
        public List<string> MemberIds { get; set; }

    }

    public class CreateP2PConverationDTO
    {
        public string UserReceiverId { get; set; }

    }
}
