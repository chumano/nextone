using Microsoft.EntityFrameworkCore.Migrations;

namespace MapService.Migrations
{
    public partial class Map_AddMapOffset : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "OffsetX",
                schema: "map",
                table: "T_Map",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "OffsetY",
                schema: "map",
                table: "T_Map",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OffsetX",
                schema: "map",
                table: "T_Map");

            migrationBuilder.DropColumn(
                name: "OffsetY",
                schema: "map",
                table: "T_Map");
        }
    }
}
