using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.DTOs.User
{
    public class ActiveUserDTO
    {
        public string UserId { get; set; }

        public bool IsActive { get; set; }

    }
}
