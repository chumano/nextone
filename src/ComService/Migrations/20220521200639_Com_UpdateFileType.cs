using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ComService.Migrations
{
    public partial class Com_UpdateFileType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FileName",
                schema: "com",
                table: "T_App_MessageFiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "FileType",
                schema: "com",
                table: "T_App_EventFiles",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileName",
                schema: "com",
                table: "T_App_EventFiles",
                type: "nvarchar(255)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileName",
                schema: "com",
                table: "T_App_MessageFiles");

            migrationBuilder.DropColumn(
                name: "FileName",
                schema: "com",
                table: "T_App_EventFiles");

            migrationBuilder.AlterColumn<string>(
                name: "FileType",
                schema: "com",
                table: "T_App_EventFiles",
                type: "varchar(50)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
