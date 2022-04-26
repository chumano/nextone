using FileService.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileService.Infrastructure
{
    public class FileDbContext : DbContext
    {
        public const string DB_SCHEMA = "file";
        public DbSet<FileInfo> Files { get; set; }

        public FileDbContext(DbContextOptions<FileDbContext> options) : base(options)
        {
            System.Diagnostics.Debug.WriteLine("FileDbContext::ctor ->" + this.GetHashCode());
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<FileInfo>(eb =>
            {
                eb.ToTable("T_Files", DB_SCHEMA)
                    .HasKey("Id");

                eb.Property(o => o.Id)
                    .HasColumnType("varchar(36)");

                eb.Property(o => o.FileName)
                    .HasColumnType("nvarchar(255)")
                    .IsRequired();

                eb.Property(o => o.FileType)
                    .HasColumnType("nvarchar(50)")
                    .IsRequired();

                eb.Property(o => o.RelativePath)
                    .HasColumnType("nvarchar(512)")
                    .IsRequired();

                eb.Property(o => o.SystemFeature)
                    .HasColumnType("nvarchar(255)")
                    ;

                eb.Property(o => o.CreatedDate)
                    .HasColumnType("datetime")
                    ;

                eb.Property(o => o.CreatedBy)
                   .HasColumnType("nvarchar(255)")
                   ;
            });
        }
    }
}
