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

            //Conversation
            modelBuilder.Entity<Conversation>(eb =>
            {
                eb.ToTable("T_App_Conversation", DB_SCHEMA)
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

                eb.HasMany<ConversationMember>(o => o.Members)
                    .WithOne()
                    .HasForeignKey(o => o.ConversationId);
            });

            modelBuilder.Entity<ConversationMember>(eb =>
            {
                eb.ToTable("T_App_ConversationMember", DB_SCHEMA)
                  .HasKey("ChannelId", "UserId");

                eb.Property(o => o.UserId)
                    .HasColumnType("char(16)");
                eb.Property(o => o.ConversationId)
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
            //Message
            modelBuilder.Entity<Message>(eb =>
            {
            });

            modelBuilder.Entity<MessageFile>(eb =>
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
