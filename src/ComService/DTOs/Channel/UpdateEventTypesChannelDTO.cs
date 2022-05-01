using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.DTOs.Channel
{
    public class UpdateEventTypesChannelDTO
    {
        public string ChannelId { get; set; }
        public string Name { get; set; }
        public List<string> EventTypeCodes { get; set; }
    }
}
