using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ComService.Migrations
{
    public partial class Com_AppSettings : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "T_App_Settings",
                schema: "com",
                columns: table => new
                {
                    Code = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Group = table.Column<string>(type: "nvarchar(255)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_App_Settings", x => x.Code);
                });

            migrationBuilder.CreateIndex(
                name: "IX_T_App_Event_EventTypeCode",
                schema: "com",
                table: "T_App_Event",
                column: "EventTypeCode");

            migrationBuilder.AddForeignKey(
                name: "FK_T_App_Event_T_App_EventType_EventTypeCode",
                schema: "com",
                table: "T_App_Event",
                column: "EventTypeCode",
                principalSchema: "com",
                principalTable: "T_App_EventType",
                principalColumn: "Code",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_T_App_Event_T_App_EventType_EventTypeCode",
                schema: "com",
                table: "T_App_Event");

            migrationBuilder.DropTable(
                name: "T_App_Settings",
                schema: "com");

            migrationBuilder.DropIndex(
                name: "IX_T_App_Event_EventTypeCode",
                schema: "com",
                table: "T_App_Event");
        }
    }
}
