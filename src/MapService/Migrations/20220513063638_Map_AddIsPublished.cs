using Microsoft.EntityFrameworkCore.Migrations;

namespace MapService.Migrations
{
    public partial class Map_AddIsPublished : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPublished",
                schema: "map",
                table: "T_Map",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPublished",
                schema: "map",
                table: "T_Map");
        }
    }
}
