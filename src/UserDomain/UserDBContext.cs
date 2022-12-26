using Microsoft.EntityFrameworkCore;
using System;

namespace UserDomain
{
    public class UserDBContext : DbContext
    {
        public const string DB_SCHEMA = "master";

        public DbSet<UserActivity> UserActivities { get; set; }

        public UserDBContext(DbContextOptions<UserDBContext> options) : base(options)
        {
            System.Diagnostics.Debug.WriteLine("UserDBContext::ctor ->" + this.GetHashCode());
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserActivity>(eb =>
            {
                eb.HasQueryFilter(p => !p.IsDeleted);

                eb.ToTable("UserActivity", DB_SCHEMA)
                   .HasKey(o => o.Id);

                eb.Property(o => o.Id)
                    .HasColumnType("varchar(36)");

                eb.Property(o => o.UserId)
                    .HasColumnType("varchar(36)");
                eb.Property(o => o.UserName)
                    .HasColumnType("nvarchar(255)");

                eb.Property(o => o.System)
                    .HasColumnType("nvarchar(255)");

                eb.Property(o => o.Action)
                    .HasColumnType("nvarchar(255)");

                eb.Property(o => o.Description)
                    .HasColumnType("nvarchar(max)");

                eb.Property(o => o.IsDeleted)
                    .HasColumnType("bit")
                    .HasDefaultValue(false)
                    .IsRequired();

                eb.Property(o => o.CreatedDate)
                    .HasColumnType("datetime");

                eb.Property(o => o.DeletedBy)
                    .HasColumnType("varchar(36)");

                eb.Property(o => o.DeletedDate)
                     .HasColumnType("datetime");
            });
        }
    }
}
