using IdentityService.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace IdentityService.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public const string DB_SCHEMA = "identity";

        public DbSet<ApplicationSystem> Systems { get; set; }
        // public DbSet<ApplicationPage> SystemPages { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.HasDefaultSchema(DB_SCHEMA);

            //https://github.com/dotnet/EntityFramework.Docs/blob/main/samples/core/Modeling/DataSeeding/DataSeedingContext.cs

            builder.Entity<ApplicationSystem>(eb =>
            {
                eb.ToTable("ApplicationSystems", DB_SCHEMA)
                .HasKey("Code");

                eb.Property(o => o.Code)
                    .HasColumnType("nvarchar(255)")
                    .IsRequired();

                eb.Property(o => o.Name)
                   .HasColumnType("nvarchar(255)")
                   .IsRequired();

                eb.HasMany(o => o.Pages)
                    .WithOne()
                    .HasForeignKey(o => o.SystemCode);
            });


            builder.Entity<ApplicationPage>(eb =>
            {
                eb.ToTable("ApplicationPages", DB_SCHEMA)
                    .HasKey("SystemCode", "Name");

                eb.Property(o => o.SystemCode)
                    .HasColumnType("nvarchar(255)")

               .IsRequired();
                eb.Property(o => o.Name)
                   .HasColumnType("nvarchar(255)")
                   .IsRequired();

                eb.Property(o => o.Url)
                   .HasColumnType("nvarchar(255)")
                   .IsRequired();
            });

            #region ApplicationSystem Seed
            //builder.Entity<ApplicationSystem>().HasData(
            //    new List<ApplicationSystem>(){
            //        new ApplicationSystem()
            //        {
            //            Code = "NextOne",
            //            Name = "Next One"
            //        }
            //    }
            //  );

            //builder.Entity<ApplicationSystem>()
            //    .HasData(
            //        new ApplicationPage()
            //        {
            //            SystemCode = "NextOne",
            //            Name = "UCom",
            //            Url = "http://nextone.local"
            //        },
            //        new ApplicationPage()
            //        {
            //            SystemCode = "NextOne",
            //            Name = "Map",
            //            Url = "http://map.nextone.local"
            //        });
            #endregion
        }
    }
}
