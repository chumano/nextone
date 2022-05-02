using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.DTOs.Role
{
    public class UpdateRoleDTO
    {
        public string Code { get; set; }
        public string Name { get; set; }

        public List<string> PermissionCodes { get; set; }
    }
}
