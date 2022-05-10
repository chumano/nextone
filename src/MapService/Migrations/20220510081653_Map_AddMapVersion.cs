using Microsoft.EntityFrameworkCore.Migrations;

namespace MapService.Migrations
{
    public partial class Map_AddMapVersion : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Version",
                schema: "map",
                table: "T_Map",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "_bbMaxX",
                schema: "map",
                table: "T_Map",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "_bbMaxY",
                schema: "map",
                table: "T_Map",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "_bbMinX",
                schema: "map",
                table: "T_Map",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "_bbMixY",
                schema: "map",
                table: "T_Map",
                type: "float",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Version",
                schema: "map",
                table: "T_Map");

            migrationBuilder.DropColumn(
                name: "_bbMaxX",
                schema: "map",
                table: "T_Map");

            migrationBuilder.DropColumn(
                name: "_bbMaxY",
                schema: "map",
                table: "T_Map");

            migrationBuilder.DropColumn(
                name: "_bbMinX",
                schema: "map",
                table: "T_Map");

            migrationBuilder.DropColumn(
                name: "_bbMixY",
                schema: "map",
                table: "T_Map");
        }
    }
}
