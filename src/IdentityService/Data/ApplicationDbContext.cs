using IdentityService.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace IdentityService.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public const string DB_SCHEMA = "identity";
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.HasDefaultSchema(DB_SCHEMA);

            //https://github.com/dotnet/EntityFramework.Docs/blob/main/samples/core/Modeling/DataSeeding/DataSeedingContext.cs
        }
    }
}
