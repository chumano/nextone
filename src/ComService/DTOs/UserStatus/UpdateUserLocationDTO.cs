using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.DTOs.UserStatus
{
    public class UpdateUserLocationDTO
    {
        public string UserId { get; set; }

        public double? Lat { get; set; }
        public double? Lon { get; set; }
    }
}
