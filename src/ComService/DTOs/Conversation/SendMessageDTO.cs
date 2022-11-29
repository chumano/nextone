using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.DTOs.Conversation
{
    public class SendMessageDTO
    {
        public string ConversationId { get; set; }
        public string UserId { get; set; }
        public string Content { get; set; }

        public IList<FileDTO> Files { get; set; }

        public Dictionary<string, object> Properties { get; set; } 
    }

    public class SendMessage2UsersDTO
    {
        public IList<string> UserIds { get; set; }
        public string Content { get; set; }

        public IList<FileDTO> Files { get; set; }

        public Dictionary<string, object> Properties { get; set; }
    }
}
