using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ComService.Migrations
{
    public partial class Com_ConversationUserSeen : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "SeenDate",
                schema: "com",
                table: "T_App_ConversationMember",
                type: "datetime2",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SeenDate",
                schema: "com",
                table: "T_App_ConversationMember");
        }
    }
}
