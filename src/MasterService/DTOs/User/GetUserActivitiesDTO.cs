using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.DTOs.User
{
    public class GetUserActivitiesDTO
    {
        public string UserId { get; set; }
        public int Offset { get; set; }
        public int PageSize { get; set; }
    }
}
