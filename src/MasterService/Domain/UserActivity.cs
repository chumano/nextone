using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.Domain
{
    public class UserActivity
    {
        public string UserId { get; set; }
        public string UserName { get; set; }

        public string Action { get; set; }

        public string Data { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}
