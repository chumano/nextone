using Microsoft.EntityFrameworkCore.Migrations;

namespace MasterService.Migrations.UserDB
{
    public partial class Master_UserActivityAddId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserActivity",
                schema: "master",
                table: "UserActivity");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                schema: "master",
                table: "UserActivity",
                type: "varchar(36)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(36)");

            migrationBuilder.AddColumn<string>(
                name: "Id",
                schema: "master",
                table: "UserActivity",
                type: "varchar(36)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserActivity",
                schema: "master",
                table: "UserActivity",
                column: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserActivity",
                schema: "master",
                table: "UserActivity");

            migrationBuilder.DropColumn(
                name: "Id",
                schema: "master",
                table: "UserActivity");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                schema: "master",
                table: "UserActivity",
                type: "varchar(36)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(36)",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserActivity",
                schema: "master",
                table: "UserActivity",
                column: "UserId");
        }
    }
}
