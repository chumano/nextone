using System;
using System.Collections.Generic;
using System.Text;

namespace NextOne.Infrastructure.Core.Identity
{
    public class IdentityServerOptions
    {
        public string Authority { get; set; } = "https://localhost:5102";

        public bool RequireHttpsMetadata { get; set; } = false;
    }
}
