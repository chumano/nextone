using Microsoft.AspNetCore.Identity;

namespace IdentityService.Models
{
    public class ApplicationRole : IdentityRole
    {
        public string DisplayName { get; set; }
        public string Description { get; set; }
    }
}
