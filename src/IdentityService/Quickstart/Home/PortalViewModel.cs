using IdentityService.Data;
using System.Collections.Generic;

namespace IdentityService.Quickstart.Home
{
    public class PortalViewModel
    {
        public string SystemName { get; set; }

        public IList<ApplicationPage> Pages { get; set; }
    }
}
