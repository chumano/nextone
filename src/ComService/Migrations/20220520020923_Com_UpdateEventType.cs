using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ComService.Migrations
{
    public partial class Com_UpdateEventType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IconUrl",
                schema: "com",
                table: "T_App_EventType",
                type: "nvarchar(255)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Note",
                schema: "com",
                table: "T_App_EventType",
                type: "nvarchar(255)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IconUrl",
                schema: "com",
                table: "T_App_EventType");

            migrationBuilder.DropColumn(
                name: "Note",
                schema: "com",
                table: "T_App_EventType");
        }
    }
}
