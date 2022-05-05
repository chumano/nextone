using Microsoft.EntityFrameworkCore.Migrations;

namespace MapService.Migrations
{
    public partial class Map_AddFeatureData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FeatureData",
                schema: "map",
                table: "T_DataSource",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FeatureData",
                schema: "map",
                table: "T_DataSource");
        }
    }
}
