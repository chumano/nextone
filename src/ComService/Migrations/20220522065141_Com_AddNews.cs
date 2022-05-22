using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ComService.Migrations
{
    public partial class Com_AddNews : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "news");

            migrationBuilder.CreateTable(
                name: "T_News",
                schema: "news",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(512)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PublishedDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    PublishedBy = table.Column<string>(type: "varchar(36)", nullable: true),
                    PublishedUserName = table.Column<string>(type: "nvarchar(255)", nullable: true),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(255)", nullable: true),
                    ImageDescription = table.Column<string>(type: "nvarchar(512)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_News", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "T_News",
                schema: "news");
        }
    }
}
