using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.Domain
{
    public class User
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public List<UserRole> Roles { get; set; }
    }
}
