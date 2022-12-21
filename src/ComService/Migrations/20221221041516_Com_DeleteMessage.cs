using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ComService.Migrations
{
    public partial class Com_DeleteMessage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DeletedByUserId",
                schema: "com",
                table: "T_App_Message",
                type: "nvarchar(36)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedDate",
                schema: "com",
                table: "T_App_Message",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "com",
                table: "T_App_Message",
                type: "bit",
                nullable: true);

        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeletedByUserId",
                schema: "com",
                table: "T_App_Message");

            migrationBuilder.DropColumn(
                name: "DeletedDate",
                schema: "com",
                table: "T_App_Message");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "com",
                table: "T_App_Message");
        }
    }
}
