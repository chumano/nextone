using IdentityServerHost.Quickstart.UI;
using IdentityService.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityService.Quickstart.Home
{
    [SecurityHeaders]
    [Authorize]
    public class PortalController : Controller
    {
        private readonly ApplicationDbContext _applicationDbContext;
        public PortalController(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }
        public async Task<IActionResult> Index()
        {
            var applicationSystem = this.User.Claims.FirstOrDefault(o => o.Type == "ApplicationSystem")?.Value;
            if (string.IsNullOrWhiteSpace(applicationSystem))
            {
                return View(new PortalViewModel()
                {
                    SystemName = "Not found system of user"
                });
            }
            var system = await _applicationDbContext.Systems
                 .Include(o => o.Pages)
                 .Where(o => o.Code == applicationSystem)
                 .FirstOrDefaultAsync();

            if (system == null)
            {
                return View(new PortalViewModel()
                {
                    SystemName = "Not found system of user"
                });
            }

            var vm = new PortalViewModel()
            {
                SystemName = system.Name,
                Pages = system.Pages
            };
            return View(vm);
        }
    }
}
