using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MasterService.Migrations.UserDB
{
    public partial class Master_UserActivity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "master");

            migrationBuilder.CreateTable(
                name: "UserActivity",
                schema: "master",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "varchar(36)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(255)", nullable: true),
                    Action = table.Column<string>(type: "nvarchar(255)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeletedDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    DeletedBy = table.Column<string>(type: "varchar(36)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserActivity", x => x.UserId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserActivity",
                schema: "master");
        }
    }
}
