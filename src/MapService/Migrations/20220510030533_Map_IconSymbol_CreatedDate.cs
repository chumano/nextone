using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MapService.Migrations
{
    public partial class Map_IconSymbol_CreatedDate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "map",
                table: "T_Symbols",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                schema: "map",
                table: "T_Symbols",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "map",
                table: "T_Symbols");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                schema: "map",
                table: "T_Symbols");
        }
    }
}
