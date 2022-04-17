using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.Domain
{
    public class UserRole
    {
        public string UserId { get; set; }
        public string RoleCode { get; set; }
        public Role Role { get; set; }
    }
}
