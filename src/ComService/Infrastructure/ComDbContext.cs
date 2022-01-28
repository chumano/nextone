using ComService.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Infrastructure
{
    public class ComDbContext : DbContext
    {
        public const string DB_SCHEMA = "com";

        public ComDbContext(DbContextOptions<ComDbContext> options) : base(options)
        {
            System.Diagnostics.Debug.WriteLine("ComDbContext::ctor ->" + this.GetHashCode());
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //Channel
            modelBuilder.Entity<Channel>(eb =>
            {
                eb.ToTable("Channel", DB_SCHEMA)
                   .HasKey("Id");

                eb.Property(o => o.Id)
                    .HasColumnType("char(16)");
                eb.Property(o => o.Name)
                    .HasColumnType("nvarchar(255)")
                    .IsRequired();

                eb.Property(o => o.IsActive)
                    .HasColumnType("bit")
                    .HasDefaultValue(true)
                    .IsRequired();

                eb.Property(o => o.IsDeleted)
                    .HasColumnType("bit")
                    .HasDefaultValue(false)
                    .IsRequired();

                eb.HasMany<ChannelMember>(o => o.Members)
                    .WithOne()
                    .HasForeignKey(o => o.ChannelId);
            });

            modelBuilder.Entity<ChannelMember>(eb =>
            {
                eb.ToTable("ChannelMember", DB_SCHEMA)
                  .HasKey("ChannelId", "UserId");

                eb.Property(o => o.UserId)
                    .HasColumnType("char(16)");
                eb.Property(o => o.ChannelId)
                    .HasColumnType("char(16)");

                eb.Property(o => o.Role)
                    .HasColumnType("varchar(20)")
                    .HasConversion(
                        v => v.ToString(),
                        v => (MemberRoleEnum)Enum.Parse(typeof(MemberRoleEnum), v)
                    )
                    .IsRequired();
            });

            //=============================
            //Event
            modelBuilder.Entity<Event>(eb =>
            {
            });

            modelBuilder.Entity<EventResponse>(eb =>
            {
            });

            modelBuilder.Entity<EventType>(eb =>
            {
            });

            modelBuilder.Entity<EventFile>(eb =>
            {
            });

            //=============================
            //ChatRoom
            modelBuilder.Entity<ChatRoom>(eb =>
            {
            });

            modelBuilder.Entity<ChatRoomMember>(eb =>
            {
            });

            modelBuilder.Entity<ChatMessage>(eb =>
            {
            });

            modelBuilder.Entity<ChatMessageFile>(eb =>
            {
            });

            //=============================
            //UserStatus
            modelBuilder.Entity<UserStatus>(eb =>
            {
            });
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }

    }
}
