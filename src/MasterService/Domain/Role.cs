using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.Domain
{
    public class Role
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public List<RolePermission> Permissions { get; set; }
    }
}
