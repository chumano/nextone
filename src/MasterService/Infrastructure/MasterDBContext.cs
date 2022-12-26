using MasterService.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserDomain;

namespace MasterService.Infrastructure
{
    public class MasterDBContext : DbContext
    {
        public const string DB_SCHEMA = "master";

        public DbSet<SystemSetting> SystemSettings { get; set; }
        public DbSet<UserActivity> UserActivities { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public MasterDBContext(DbContextOptions<MasterDBContext> options) : base(options)
        {
            System.Diagnostics.Debug.WriteLine("MasterDBContext::ctor ->" + this.GetHashCode());
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserActivity>(eb =>
            {
                eb.ToTable("UserActivity", DB_SCHEMA);

                eb.HasQueryFilter(p => !p.IsDeleted);
            });

            //user
            modelBuilder.Entity<User>(eb =>
            {
                eb.HasQueryFilter(p => !p.IsDeleted);

                eb.ToTable("User", DB_SCHEMA)
                   .HasKey("Id");

                eb.Property(o => o.Id)
                    .HasColumnType("varchar(36)");
                eb.Property(o => o.Name)
                    .HasColumnType("nvarchar(255)")
                    .IsRequired();
                eb.Property(o => o.Email)
                    .HasColumnType("varchar(255)");
                eb.Property(o => o.Phone)
                    .HasColumnType("varchar(20)");
             

                eb.HasMany<UserRole>(o => o.Roles)
                    .WithOne()
                    .HasForeignKey(o => o.UserId);

                eb.Property(o => o.IsActive)
                 .HasColumnType("bit")
                 .HasDefaultValue(true)
                 .IsRequired();

                eb.Property(o => o.IsDeleted)
                    .HasColumnType("bit")
                    .HasDefaultValue(false)
                    .IsRequired();

                eb.Property(o => o.CreatedBy)
                    .HasColumnType("varchar(36)");

                eb.Property(o => o.UpdatedBy)
                     .HasColumnType("varchar(36)");

                eb.Property(o => o.CreatedDate)
                    .HasColumnType("datetime");

                eb.Property(o => o.UpdatedDate)
                  .HasColumnType("datetime");
            });

            modelBuilder.Entity<UserRole>(eb =>
            {
                eb.ToTable("UserRole", DB_SCHEMA)
                   .HasKey("UserId", "RoleCode");

                eb.Property(o => o.UserId)
                    .HasColumnType("varchar(36)");
                eb.Property(o => o.RoleCode)
                   .HasColumnType("varchar(20)");

                eb.HasOne<Role>(o => o.Role)
                    .WithMany()
                    .HasForeignKey(o => o.RoleCode);
            });

            //role
            modelBuilder.Entity<Role>(eb =>
            {
                eb.ToTable("Role", DB_SCHEMA)
                   .HasKey("Code");

                eb.Property(o => o.Code)
                    .HasColumnType("varchar(20)");
                eb.Property(o => o.Name)
                   .HasColumnType("varchar(255)")
                   .IsRequired();

                eb.HasMany<RolePermission>(o => o.Permissions)
                    .WithOne()
                    .HasForeignKey(o => o.RoleCode);
            });

            modelBuilder.Entity<RolePermission>(eb =>
            {
                eb.ToTable("RolePermission", DB_SCHEMA)
                   .HasKey("RoleCode", "PermissionCode");

                eb.Property(o => o.RoleCode)
                    .HasColumnType("varchar(20)");
                eb.Property(o => o.PermissionCode)
                   .HasColumnType("varchar(50)");

                eb.HasOne<Permission>(o => o.Permission)
                    .WithMany()
                    .HasForeignKey(o => o.PermissionCode);
            });

            modelBuilder.Entity<Permission>(eb =>
            {
                eb.ToTable("Permission", DB_SCHEMA)
                   .HasKey("Code");

                eb.Property(o => o.Code)
                    .HasColumnType("varchar(50)");
                eb.Property(o => o.Name)
                   .HasColumnType("nvarchar(255)")
                   .IsRequired();

            });


            modelBuilder.Entity<SystemSetting>(eb =>
            {
                eb.ToTable("SystemSetting", DB_SCHEMA)
                 .HasKey("Code");

                eb.Property(o => o.Code)
                 .HasColumnType("varchar(50)");
                
                eb.Property(o => o.Name)
                   .HasColumnType("nvarchar(255)")
                   .IsRequired();

                eb.Property(o => o.Data)
                   .HasColumnType("nvarchar(max)")
                   .IsRequired();
            });
        }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }

       
    }
}
