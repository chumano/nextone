using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.Domain
{
    public class UserActivity
    {
        public UserActivity(string userId, string userName, 
            string system,
            string action,
            string data)
        {
            UserId = userId;
            UserName = userName;
            System = system;
            Action = action;
            Data = data;
            CreatedDate = DateTime.Now;

        }
        public string UserId { get; private set; }
        public string UserName { get; private set; }

        public string System { get; private set; }
        public string Action { get; private set; }

        public string Data { get; private set; }

        public DateTime CreatedDate { get; private set; }
    }
}
