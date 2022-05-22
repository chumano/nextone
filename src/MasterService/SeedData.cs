using MasterService.Domain;
using System.Collections.Generic;

namespace MasterService
{
    public class SeedData
    {
        public static IEnumerable<Role> Roles => new Role[]
           {
                new Domain.Role("admin","Administrator"),
                new Domain.Role("manager","Manager"),
                new Domain.Role("member","Member")
           };
    }
}
