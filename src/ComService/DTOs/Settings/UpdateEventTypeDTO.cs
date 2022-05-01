using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.DTOs.Settings
{
    public class UpdateEventTypeDTO
    {
        public string Code { get; set; }
        public string Name { get; set; }

        public string IconUrl { get; set; }

        public string Note { get; set; }
    }
}
