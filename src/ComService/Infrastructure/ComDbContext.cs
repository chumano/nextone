using ComService.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NextOne.Shared.Extenstions;

namespace ComService.Infrastructure
{
    public class ComDbContext : DbContext
    {
        public const string DB_SCHEMA = "com";
        public DbSet<Conversation> Conversations { get; set; }

        public DbSet<Channel> Channels { get; set; }
        //{
        //    get
        //    {
        //        return Conversations.OfType<Channel>();
        //    }
        //}

        public DbSet<Message> Messages { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<UserStatus> Users { get; set; }
        public DbSet<EventType> EventTypes { get; set; }
        public DbSet<Settings> Settings { get; set; }

        public DbSet<News> News { get; set; }
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
                eb.HasDiscriminator(o => o.Type)
                    .HasValue<PrivateConversation>(ConversationTypeEnum.Private)
                    .HasValue<P2PConversation>(ConversationTypeEnum.Peer2Peer)
                    .HasValue<GroupConversation>(ConversationTypeEnum.Group)
                    .HasValue<Channel>(ConversationTypeEnum.Channel);

                eb.ToTable("T_App_Conversation", DB_SCHEMA)
                   .HasKey("Id");

                eb.Property(o => o.Id)
                    .HasColumnType("varchar(36)");

                eb.Property(o => o.Name)
                    .HasColumnType("nvarchar(255)")
                    .IsRequired();


                eb.Property(o => o.Type)
                   .HasColumnType("int")
                   .HasConversion(
                        v => (int)v,
                        v => (ConversationTypeEnum)v
                    )
                   .IsRequired();

                eb.Property(o => o.IsActive)
                    .HasColumnType("bit")
                    .HasDefaultValue(false)
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

                eb.HasMany<ConversationMember>(o => o.Members)
                    .WithOne()
                    .HasForeignKey(o => o.ConversationId);

                eb.HasMany<Message>(o => o.RecentMessages)
                   .WithOne()
                   .HasForeignKey(o => o.ConversationId);
            });


            modelBuilder.Entity<ConversationMember>(eb =>
            {
                eb.ToTable("T_App_ConversationMember", DB_SCHEMA)
                  .HasKey("ConversationId", "UserId");

                eb.Property(o => o.UserId)
                    .HasColumnType("varchar(36)");

                eb.Property(o => o.ConversationId)
                    .HasColumnType("varchar(36)");

                eb.Property(o => o.Role)
                    .HasColumnType("varchar(20)")
                    .HasConversion(
                        v => v.ToString(),
                        v => (MemberRoleEnum)Enum.Parse(typeof(MemberRoleEnum), v)
                    )
                    .IsRequired();

                eb.HasOne(o => o.UserMember)
                 .WithMany()
                 .HasForeignKey(o => o.UserId);
            });
            //=============================
            //Message
            modelBuilder.Entity<Message>(eb =>
            {
                eb.ToTable("T_App_Message", DB_SCHEMA)
                   .HasKey("Id");

                eb.Property(o => o.Id)
                    .HasColumnType("varchar(36)");
                eb.Property(o => o.ConversationId)
                    .HasColumnType("varchar(36)")
                    .IsRequired();

                eb.Property(o => o.Type)
                   .HasColumnType("int")
                   .HasConversion(
                        v => (int)v,
                        v => (MessageTypeEnum)v
                    );

                eb.Property(o => o.SentDate)
                   .HasColumnType("datetime");

                eb.Property(o => o.UserSenderId)
                   .HasColumnType("varchar(36)");

                eb.Property(o => o.Content)
                  .HasColumnType("nvarchar(max)");

                eb.Property(o => o.EventId)
                    .HasColumnType("varchar(36)");


                eb.HasOne(o => o.Event)
                    .WithOne()
                    .HasForeignKey<Message>(o => o.EventId);

                eb.HasOne(o => o.UserSender)
                    .WithMany()
                    .HasForeignKey(o => o.UserSenderId);

                eb.HasMany(o => o.Files)
                    .WithOne()
                    .HasForeignKey(o => o.MessageId);


            });

            modelBuilder.Entity<MessageFile>(eb =>
            {
                eb.ToTable("T_App_MessageFiles", DB_SCHEMA)
                 .HasKey("MessageId", "FileId");

                eb.Property(o => o.MessageId)
                    .HasColumnType("varchar(36)");
                eb.Property(o => o.FileId)
                    .HasColumnType("varchar(36)");

                eb.Property(o => o.FileUrl)
                   .HasColumnType("nvarchar(255)");

                eb.Property(o => o.FileType)
                   .HasColumnType("int");
            });


            //=============================
            //Channel
            modelBuilder.Entity<Channel>(eb =>
            {
                eb.HasMany(o => o.AllowedEventTypes)
                  .WithOne()
                  .HasForeignKey(o => o.ChannelId);

                eb.HasMany(o => o.RecentEvents)
                    .WithOne()
                    .HasForeignKey(o => o.ChannelId);
            });

            modelBuilder.Entity<ChannelEventType>(eb =>
            {
                eb.ToTable("T_App_ChannelEventTypes", DB_SCHEMA)
                 .HasKey("ChannelId", "EventTypeCode");

                eb.Property(o => o.ChannelId)
                .HasColumnType("varchar(36)");

                eb.Property(o => o.EventTypeCode)
                    .HasColumnType("nvarchar(50)")
                    .IsRequired();

                eb.HasOne(o => o.EventType)
                    .WithMany()
                    .HasForeignKey(o => o.EventTypeCode);
            });

            //=============================
            //Event
            modelBuilder.Entity<Event>(eb =>
            {
                eb.ToTable("T_App_Event", DB_SCHEMA)
                 .HasKey("Id");

                eb.Property(o => o.Id)
                    .HasColumnType("varchar(36)");

                eb.Property(o => o.Content)
                    .HasColumnType("nvarchar(max)")
                    .IsRequired();

                eb.Property(o => o.EventTypeCode)
                    .HasColumnType("nvarchar(50)")
                    .IsRequired();

                eb.Property(o => o.OccurDate)
                    .HasColumnType("datetime")
                    .IsRequired();

                eb.Property(o => o.CreatedDate)
                    .HasColumnType("datetime")
                    .IsRequired();

                eb.Property(o => o.Address)
                    .HasColumnType("nvarchar(255)");


                eb.Property(o => o.Lat)
                    .HasColumnType("float");

                eb.Property(o => o.Lon)
                    .HasColumnType("float");

                eb.Property(o => o.ChannelId)
                    .HasColumnType("varchar(36)")
                    .IsRequired();

                eb.Property(o => o.UserSenderId)
                    .HasColumnType("varchar(36)");

                eb.Property(o => o.IsActive)
                   .HasColumnType("bit")
                   .HasDefaultValue(false)
                   .IsRequired();

                eb.Property(o => o.IsDeleted)
                    .HasColumnType("bit")
                    .HasDefaultValue(false)
                    .IsRequired();

                eb.HasOne(o => o.EventType)
                    .WithMany()
                    .HasForeignKey(o => o.EventTypeCode);
            });



            modelBuilder.Entity<EventType>(eb =>
            {
                eb.ToTable("T_App_EventType", DB_SCHEMA)
                 .HasKey("Code");

                eb.Property(o => o.Code)
                    .HasColumnType("nvarchar(50)");

                eb.Property(o => o.Name)
                    .HasColumnType("nvarchar(255)")
                    .IsRequired();

                eb.Property(o => o.IconUrl)
                    .HasColumnType("nvarchar(255)");

                eb.Property(o => o.Note)
                  .HasColumnType("nvarchar(255)");
            });

            modelBuilder.Entity<EventFile>(eb =>
            {
                eb.ToTable("T_App_EventFiles", DB_SCHEMA)
                .HasKey("EventId", "FileId");

                eb.Property(o => o.EventId)
                    .HasColumnType("varchar(36)");
                eb.Property(o => o.FileId)
                    .HasColumnType("varchar(36)");

                eb.Property(o => o.FileName)
                 .HasColumnType("nvarchar(255)");

                eb.Property(o => o.FileUrl)
                  .HasColumnType("nvarchar(255)");

                eb.Property(o => o.FileType)
                   .HasColumnType("int");
            });

            //modelBuilder.Entity<EventResponse>(eb =>
            //{
            //});
            //=============================
            //UserStatus
            modelBuilder.Entity<UserStatus>(eb =>
            {
                eb.ToTable("T_App_UserStatus", DB_SCHEMA)
                  .HasKey("UserId");

                eb.Property(o => o.UserId)
                    .HasColumnType("varchar(36)");

                eb.Property(o => o.UserName)
                    .HasColumnType("nvarchar(255)")
                    .IsRequired();

                eb.Property(o => o.UserAvatarUrl)
                   .HasColumnType("nvarchar(255)");

                eb.Property(o => o.Status)
                   .HasColumnType("int")
                   .HasConversion(
                        v => (int)v,
                        v => (StatusEnum)v
                    );

                eb.Property(o => o.LastUpdateDate)
                  .HasColumnType("datetime");

                eb.Property(o => o.LastLat)
                  .HasColumnType("float");

                eb.Property(o => o.LastLon)
                  .HasColumnType("float");

                eb.HasMany(o => o.RecentTrackingLocations)
                    .WithOne()
                    .HasForeignKey(o => o.UserId);
            });

            modelBuilder.Entity<UserTrackingLocation>(eb =>
            {
                eb.ToTable("T_App_UserTrackingLocations", DB_SCHEMA)
                 .HasKey("UserId", "Date");

                eb.Property(o => o.UserId)
                    .HasColumnType("varchar(36)");

                eb.Property(o => o.Date)
                .HasColumnType("datetime");

                eb.Property(o => o.Lat)
                  .HasColumnType("float");

                eb.Property(o => o.Lon)
                  .HasColumnType("float");
            });


            modelBuilder.Entity<Settings>(eb =>
            {
                eb.ToTable("T_App_Settings", DB_SCHEMA)
                 .HasKey("Code");

                eb.Property(o => o.Code)
                    .HasColumnType("nvarchar(50)");

                eb.Property(o => o.Name)
                    .HasColumnType("nvarchar(255)")
                    .IsRequired();

                eb.Property(o => o.Value)
                    .HasColumnType("nvarchar(max)");

                eb.Property(o => o.Group)
                  .HasColumnType("nvarchar(255)");
            });

            BuildNewsModels(modelBuilder);
        }

        void BuildNewsModels(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<News>(eb =>
            {
                eb.ToTable("T_News", "news")
                 .HasKey("Id");

                eb.Property(o => o.Id)
                    .HasColumnType("varchar(36)");

                eb.Property(o => o.Title)
                    .HasColumnType("nvarchar(255)")
                    .IsRequired();

                eb.Property(o => o.Description)
                   .HasColumnType("nvarchar(512)")
                   .IsRequired();

                eb.Property(o => o.Content)
                  .HasColumnType("nvarchar(max)")
                  .IsRequired();

                eb.Property(o => o.PublishedDate)
                    .HasColumnType("datetime");

                eb.Property(o => o.PublishedBy)
                        .HasColumnType("varchar(36)");

                eb.Property(o => o.PublishedUserName)
                        .HasColumnType("nvarchar(255)");

                eb.Property(o => o.IsPublished)
                  .HasColumnType("bit")
                  .IsRequired();

                eb.Property(o => o.ImageUrl)
                      .HasColumnType("nvarchar(255)");

                eb.Property(o => o.ImageDescription)
                      .HasColumnType("nvarchar(512)");
            });
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }

    }
}
