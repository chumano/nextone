using System.Collections.Generic;

namespace MasterService.DTOs.User
{
    public class UpdateUserRolesDTO
    {
        public string UserId { get; set; }
        public List<string> RoleCodes { get; set; }
    }
}
