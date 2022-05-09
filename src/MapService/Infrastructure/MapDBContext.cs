using MapService.Domain;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Collections.Generic;
using NextOne.Shared.Extenstions;

namespace MapService.Infrastructure
{
    public class MapDBContext : DbContext
    {
        public const string DB_SCHEMA = "map";
        public DbSet<MapInfo> Maps { get; set; }
        public DbSet<DataSource> DataSources { get; set; }
        public DbSet<IconSymbol> Symbols { get; set; }

        public MapDBContext(DbContextOptions<MapDBContext> options) : base(options)
        {
            System.Diagnostics.Debug.WriteLine("MapDBContext::ctor ->" + this.GetHashCode());
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<MapInfo>(eb =>
            {
                eb.ToTable("T_Map", DB_SCHEMA)
                 .HasKey("Id");

                eb.Property(o => o.Id)
                    .HasColumnType("varchar(36)");

                eb.Property(o => o.Name)
                    .HasColumnType("nvarchar(255)")
                    .IsRequired();

                eb.Property(o => o.Note)
                    .HasColumnType("nvarchar(max)");

                eb.Property(o => o.ImageData)
                    .HasColumnType("varbinary(max)");

                eb.HasMany(o => o.Layers)
                    .WithOne()
                    .HasForeignKey(o => o.MapId);
            });

            modelBuilder.Entity<MapLayer>(eb =>
            {
                eb.ToTable("T_MapLayer", DB_SCHEMA)
                .HasKey("MapId", "LayerIndex");

                eb.Property(o => o.MapId)
                    .HasColumnType("varchar(36)");

                eb.Property(o => o.LayerName)
                    .HasColumnType("nvarchar(255)")
                    .IsRequired();

                eb.Property(o => o.LayerGroup)
                  .HasColumnType("nvarchar(255)");

                eb.Property(o => o.LayerIndex)
                    .HasColumnType("int")
                    .IsRequired();

                eb.Property(o => o.DataSourceId)
                   .HasColumnType("varchar(36)")
                  .IsRequired();

                eb.Property(o => o.Active)
                  .HasColumnType("bit")
                  ;

                eb.Property(o => o.MinZoom)
                   .HasColumnType("int")
                   ;

                eb.Property(o => o.MaxZoom)
                   .HasColumnType("int")
                   ;

                eb.Property(o => o.PaintProperties)
                .HasColumnType("nvarchar(max)")
                .HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject<Dictionary<string, object>>(v)
                    );

                eb.Property(o => o.Note)
                   .HasColumnType("nvarchar(max)")
                   ;

                eb.HasOne(o => o.DataSource)
                .WithMany()
                .HasForeignKey(o => o.DataSourceId);
            });

            modelBuilder.Entity<DataSource>(eb =>
            {
                eb.ToTable("T_DataSource", DB_SCHEMA)
                .HasKey("Id");

                eb.Property(o => o.Id)
                    .HasColumnType("varchar(36)");

                eb.Property(o => o.Name)
                    .HasColumnType("nvarchar(255)")
                    .IsRequired();

                eb.Property(o => o.SourceFile)
                   .HasColumnType("nvarchar(255)")
                   .IsRequired();

                eb.Property(o => o.DataSourceType)
                  .HasColumnType("int")
                  .HasConversion(
                       v => (int)v,
                       v => (DataSourceTypeEnum)v
                   );

                eb.Property(o => o.GeoType)
                  .HasColumnType("int")
                  .HasConversion(
                       v => (int)v,
                       v => (GeoTypeEnum)v
                   );

                eb.Property(o => o.Tags)
                 .HasColumnType("nvarchar(max)")
                 .HasConversion(
                     v => v.ToDBString(","),
                     v => v.ToListFromDBString(",")
                 );

                eb.Property(o => o.Properties)
                 .HasColumnType("nvarchar(max)")
                 .HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject<Dictionary<string, object>>(v)
                 );

                eb.Property(o => o.FeatureData)
                .HasColumnType("nvarchar(max)");

                eb.Property(o=> o.ImageData)
                .HasColumnType("varbinary(max)");


                eb.Property("_bbMinX")
                .HasColumnType("float");

                eb.Property("_bbMixY")
                .HasColumnType("float");

                eb.Property("_bbMaxX")
                .HasColumnType("float");

                eb.Property("_bbMaxY")
                .HasColumnType("float");

                eb.HasIndex(e => e.DataSourceType)
                .IsClustered(false);

            });

            modelBuilder.Entity<IconSymbol>(eb =>
            {
                eb.ToTable("T_Symbols", DB_SCHEMA)
                 .HasKey("Name");


                eb.Property(o => o.Name)
                    .HasColumnType("nvarchar(255)");


                eb.Property(o => o.Width)
                    .HasColumnType("int");

                eb.Property(o => o.Height)
                    .HasColumnType("int");

                eb.Property(o => o.ImageData)
                    .HasColumnType("varbinary(max)");
            });
        }
    }
}
