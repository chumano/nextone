using Microsoft.EntityFrameworkCore.Migrations;

namespace IdentityService.Migrations
{
    public partial class Idenity_Add_ApplicationSystem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApplicationSystem",
                schema: "identity",
                table: "AspNetUsers",
                type: "nvarchar(256)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApplicationSystem",
                schema: "identity",
                table: "AspNetUsers");
        }
    }
}
