using System;
using System.Collections.Generic;
using System.Text;

namespace UserDomain
{
    public class UserActivity
    {
        public UserActivity()
        {
            CreatedDate = DateTime.Now;
        }

        public string Id { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }

        public string Action { get; set; }

        public string Description { get; set; }

        public DateTime CreatedDate { get; private set; }
        public bool IsDeleted { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string DeletedBy { get; set; }
    }
}
