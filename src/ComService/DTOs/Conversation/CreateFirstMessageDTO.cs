using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.DTOs.Conversation
{
    public class CreateFirstMessageDTO
    {
        public string UserReceiverId { get; set; }

        public string Content { get; set; }

        public IList<FileDTO> Files { get; set; }
    }
}
