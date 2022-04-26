using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FileService.Migrations
{
    public partial class File_Init_Application : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "file");

            migrationBuilder.CreateTable(
                name: "T_Files",
                schema: "file",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    RelativePath = table.Column<string>(type: "nvarchar(512)", nullable: false),
                    FileType = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    SystemFeature = table.Column<string>(type: "nvarchar(255)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(255)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_Files", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "T_Files",
                schema: "file");
        }
    }
}
