using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MapService.Migrations
{
    public partial class Map_AddAuditProps : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "map",
                table: "T_Map",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                schema: "map",
                table: "T_Map",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "map",
                table: "T_Map",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDate",
                schema: "map",
                table: "T_Map",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                schema: "map",
                table: "T_DataSource",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                schema: "map",
                table: "T_DataSource",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                schema: "map",
                table: "T_DataSource",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDate",
                schema: "map",
                table: "T_DataSource",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "map",
                table: "T_Map");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                schema: "map",
                table: "T_Map");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "map",
                table: "T_Map");

            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                schema: "map",
                table: "T_Map");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "map",
                table: "T_DataSource");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                schema: "map",
                table: "T_DataSource");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                schema: "map",
                table: "T_DataSource");

            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                schema: "map",
                table: "T_DataSource");
        }
    }
}
