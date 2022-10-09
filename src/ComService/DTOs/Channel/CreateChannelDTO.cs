using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.DTOs.Channel
{
    public class CreateChannelDTO
    {
        public string Name { get; set; }
        public List<string> MemberIds { get; set; }

        public List<string> EventTypeCodes { get; set; }

        public string ParentId { get; set; }
    }
}
