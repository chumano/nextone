﻿// <auto-generated />
using System;
using MapService.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace MapService.Migrations
{
    [DbContext(typeof(MapDBContext))]
    [Migration("20220425084239_Map_Init_ApplicationDB")]
    partial class Map_Init_ApplicationDB
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.24")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("MapService.Domain.DataSource", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(36)");

                    b.Property<int>("DataSourceType")
                        .HasColumnType("int");

                    b.Property<int>("GeoType")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("Properties")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SourceFile")
                        .IsRequired()
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("Tags")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("T_DataSource","map");
                });

            modelBuilder.Entity("MapService.Domain.MapInfo", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(36)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(255)");

                    b.HasKey("Id");

                    b.ToTable("T_Map","map");
                });

            modelBuilder.Entity("MapService.Domain.MapLayer", b =>
                {
                    b.Property<string>("MapId")
                        .HasColumnType("varchar(36)");

                    b.Property<int>("LayerIndex")
                        .HasColumnType("int");

                    b.Property<string>("DataSourceId")
                        .IsRequired()
                        .HasColumnType("varchar(36)");

                    b.Property<string>("LayerGroup")
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("LayerName")
                        .IsRequired()
                        .HasColumnType("nvarchar(255)");

                    b.Property<int?>("MaxZoom")
                        .HasColumnType("int");

                    b.Property<int?>("MinZoom")
                        .HasColumnType("int");

                    b.Property<string>("Note")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PaintProperties")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("MapId", "LayerIndex");

                    b.HasIndex("DataSourceId");

                    b.ToTable("T_MapLayer","map");
                });

            modelBuilder.Entity("MapService.Domain.MapLayer", b =>
                {
                    b.HasOne("MapService.Domain.DataSource", "DataSource")
                        .WithMany()
                        .HasForeignKey("DataSourceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MapService.Domain.MapInfo", null)
                        .WithMany("Layers")
                        .HasForeignKey("MapId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
