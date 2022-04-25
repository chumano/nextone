using Microsoft.EntityFrameworkCore.Migrations;

namespace MapService.Migrations
{
    public partial class Map_Init_ApplicationDB : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "map");

            migrationBuilder.CreateTable(
                name: "T_DataSource",
                schema: "map",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    DataSourceType = table.Column<int>(type: "int", nullable: false),
                    GeoType = table.Column<int>(type: "int", nullable: false),
                    SourceFile = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    Properties = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tags = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_DataSource", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "T_Map",
                schema: "map",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(255)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_Map", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "T_MapLayer",
                schema: "map",
                columns: table => new
                {
                    MapId = table.Column<string>(type: "varchar(36)", nullable: false),
                    LayerIndex = table.Column<int>(type: "int", nullable: false),
                    LayerName = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    LayerGroup = table.Column<string>(type: "nvarchar(255)", nullable: true),
                    DataSourceId = table.Column<string>(type: "varchar(36)", nullable: false),
                    MinZoom = table.Column<int>(type: "int", nullable: true),
                    MaxZoom = table.Column<int>(type: "int", nullable: true),
                    PaintProperties = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Note = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_MapLayer", x => new { x.MapId, x.LayerIndex });
                    table.ForeignKey(
                        name: "FK_T_MapLayer_T_DataSource_DataSourceId",
                        column: x => x.DataSourceId,
                        principalSchema: "map",
                        principalTable: "T_DataSource",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_T_MapLayer_T_Map_MapId",
                        column: x => x.MapId,
                        principalSchema: "map",
                        principalTable: "T_Map",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_T_MapLayer_DataSourceId",
                schema: "map",
                table: "T_MapLayer",
                column: "DataSourceId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "T_MapLayer",
                schema: "map");

            migrationBuilder.DropTable(
                name: "T_DataSource",
                schema: "map");

            migrationBuilder.DropTable(
                name: "T_Map",
                schema: "map");
        }
    }
}
