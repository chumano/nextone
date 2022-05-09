using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MapService.Migrations
{
    public partial class Map_AddSymbol : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "T_Symbols",
                schema: "map",
                columns: table => new
                {
                    Name = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    Width = table.Column<int>(type: "int", nullable: false),
                    Height = table.Column<int>(type: "int", nullable: false),
                    ImageData = table.Column<byte[]>(type: "varbinary(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_Symbols", x => x.Name);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "T_Symbols",
                schema: "map");
        }
    }
}
