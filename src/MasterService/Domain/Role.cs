using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.Domain
{
    public class Role
    {
        private Role() { }
        public Role(string code, string name)
        {
            Code = code;
            Name = name;
        }
        public string Code { get;  private set; }
        public string Name { get; private set; }
        public List<RolePermission> Permissions { get; private set; }

        public void SetName(string name)
        {
            Name = name;
        }

        public void SetPermissions(List<RolePermission> permissions)
        {
            Permissions = permissions;
        }
    }
}
