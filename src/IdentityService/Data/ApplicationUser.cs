using Microsoft.AspNetCore.Identity;

namespace IdentityService.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string ApplicationSystem { get; set; }
    }
}
