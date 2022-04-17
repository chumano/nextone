using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Domain
{
    public class UserStatus
    {
        public string UserId { get; set; }

        public string UserName { get; set; }

        public StatusEnum Status { get; set; }

        public DateTime? LastUpdateDate { get; set; }

        public double? LastLat { get; set; }
        public double? LastLon { get; set; }

        public IList<UserTrackingLocation> RecentTrackingLocations { get; set; } 
    }

    public enum StatusEnum
    {
        Offline = 0,
        Online = 1,
        Idle = 2
    }
}
