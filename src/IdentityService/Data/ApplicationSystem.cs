using System.Collections.Generic;

namespace IdentityService.Data
{
    public class ApplicationSystem
    {
        public ApplicationSystem() { }
        public string Code { get; set; }
        public string Name { get; set; }

        public IList<ApplicationPage> Pages { get; set; }
    }

    public class ApplicationPage
    {
        public ApplicationPage() { }
        public string SystemCode { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
    }
}
