using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MapService.Migrations
{
    public partial class Map_AddImageData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Active",
                schema: "map",
                table: "T_MapLayer",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageData",
                schema: "map",
                table: "T_DataSource",
                type: "varbinary(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "_bbMaxX",
                schema: "map",
                table: "T_DataSource",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "_bbMaxY",
                schema: "map",
                table: "T_DataSource",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "_bbMinX",
                schema: "map",
                table: "T_DataSource",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "_bbMixY",
                schema: "map",
                table: "T_DataSource",
                type: "float",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_T_DataSource_DataSourceType",
                schema: "map",
                table: "T_DataSource",
                column: "DataSourceType")
                .Annotation("SqlServer:Clustered", false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_T_DataSource_DataSourceType",
                schema: "map",
                table: "T_DataSource");

            migrationBuilder.DropColumn(
                name: "Active",
                schema: "map",
                table: "T_MapLayer");

            migrationBuilder.DropColumn(
                name: "ImageData",
                schema: "map",
                table: "T_DataSource");

            migrationBuilder.DropColumn(
                name: "_bbMaxX",
                schema: "map",
                table: "T_DataSource");

            migrationBuilder.DropColumn(
                name: "_bbMaxY",
                schema: "map",
                table: "T_DataSource");

            migrationBuilder.DropColumn(
                name: "_bbMinX",
                schema: "map",
                table: "T_DataSource");

            migrationBuilder.DropColumn(
                name: "_bbMixY",
                schema: "map",
                table: "T_DataSource");
        }
    }
}
