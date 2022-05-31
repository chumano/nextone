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

        public static IEnumerable<User> Users => new User[]
           {
                new Domain.User("00000000-0000-0000-0000-000000000001","admin","admin@nextone.local",""),
                new Domain.User("00000000-0000-0000-0000-000000000002","manager","manager@nextone.local",""),
                new Domain.User("00000000-0000-0000-0000-000000000003","member","member@nextone.local",""),
           };
    }
}
