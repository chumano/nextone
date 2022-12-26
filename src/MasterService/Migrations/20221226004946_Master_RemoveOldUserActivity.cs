using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MasterService.Migrations
{
    public partial class Master_RemoveOldUserActivity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserActivity",
                schema: "master");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserActivity",
                schema: "master",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "varchar(36)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    Action = table.Column<string>(type: "varchar(255)", nullable: false),
                    Data = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    System = table.Column<string>(type: "varchar(255)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(255)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserActivity", x => new { x.UserId, x.CreatedDate });
                });
        }
    }
}
