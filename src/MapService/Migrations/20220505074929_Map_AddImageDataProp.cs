using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MapService.Migrations
{
    public partial class Map_AddImageDataProp : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "ImageData",
                schema: "map",
                table: "T_Map",
                type: "varbinary(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageData",
                schema: "map",
                table: "T_Map");
        }
    }
}
