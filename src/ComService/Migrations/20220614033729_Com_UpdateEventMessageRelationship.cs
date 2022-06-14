using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ComService.Migrations
{
    public partial class Com_UpdateEventMessageRelationship : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_T_App_Message_EventId",
                schema: "com",
                table: "T_App_Message");

            migrationBuilder.CreateIndex(
                name: "IX_T_App_Message_EventId",
                schema: "com",
                table: "T_App_Message",
                column: "EventId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_T_App_Message_EventId",
                schema: "com",
                table: "T_App_Message");

            migrationBuilder.CreateIndex(
                name: "IX_T_App_Message_EventId",
                schema: "com",
                table: "T_App_Message",
                column: "EventId",
                unique: true,
                filter: "[EventId] IS NOT NULL");
        }
    }
}
