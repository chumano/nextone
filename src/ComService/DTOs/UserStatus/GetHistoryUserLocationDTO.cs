using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.DTOs.UserStatus
{
    public class GetHistoryUserLocationDTO
    {
        public string UserId { get; set; }

        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int Offset { get; set; }
        public int PageSize { get; set; }
    }
}
