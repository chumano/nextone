using IdentityServerHost.Quickstart.UI;
using IdentityService.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        public IActionResult Index()
        {
            var vm = new PortalViewModel()
            {
                SystemName = "Chuno"
            };
            return View(vm);
        }
    }
}
