using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ComService.Migrations
{
    public partial class Com_AddChannelEventType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AllowedEventTypeCodes",
                schema: "com",
                table: "T_App_Conversation");

            migrationBuilder.CreateTable(
                name: "T_App_ChannelEventTypes",
                schema: "com",
                columns: table => new
                {
                    ChannelId = table.Column<string>(type: "varchar(36)", nullable: false),
                    EventTypeCode = table.Column<string>(type: "nvarchar(50)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_App_ChannelEventTypes", x => new { x.ChannelId, x.EventTypeCode });
                    table.ForeignKey(
                        name: "FK_T_App_ChannelEventTypes_T_App_Conversation_ChannelId",
                        column: x => x.ChannelId,
                        principalSchema: "com",
                        principalTable: "T_App_Conversation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_T_App_ChannelEventTypes_T_App_EventType_EventTypeCode",
                        column: x => x.EventTypeCode,
                        principalSchema: "com",
                        principalTable: "T_App_EventType",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_T_App_ChannelEventTypes_EventTypeCode",
                schema: "com",
                table: "T_App_ChannelEventTypes",
                column: "EventTypeCode");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "T_App_ChannelEventTypes",
                schema: "com");

            migrationBuilder.AddColumn<string>(
                name: "AllowedEventTypeCodes",
                schema: "com",
                table: "T_App_Conversation",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
