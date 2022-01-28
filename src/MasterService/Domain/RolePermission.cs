using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.Domain
{
    public class RolePermission
    {
        public string RoleCode { get; set; }
        public string PermissionCode { get; set; }
        public Permission Permission { get; set; }
    }
}
