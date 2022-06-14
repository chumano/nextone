using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ComService.Migrations
{
    public partial class Com_UpdateEventRelationship : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_T_App_Event_T_App_Conversation_ChannelId",
                schema: "com",
                table: "T_App_Event");

            migrationBuilder.DropIndex(
                name: "IX_T_App_Event_ChannelId",
                schema: "com",
                table: "T_App_Event");

            migrationBuilder.DropColumn(
                name: "ChannelId",
                schema: "com",
                table: "T_App_Event");

            migrationBuilder.CreateTable(
                name: "T_App_ChannelEvents",
                schema: "com",
                columns: table => new
                {
                    ChannelId = table.Column<string>(type: "varchar(36)", nullable: false),
                    EventId = table.Column<string>(type: "varchar(36)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_App_ChannelEvents", x => new { x.ChannelId, x.EventId });
                    table.ForeignKey(
                        name: "FK_T_App_ChannelEvents_T_App_Conversation_ChannelId",
                        column: x => x.ChannelId,
                        principalSchema: "com",
                        principalTable: "T_App_Conversation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_T_App_ChannelEvents_T_App_Event_EventId",
                        column: x => x.EventId,
                        principalSchema: "com",
                        principalTable: "T_App_Event",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_T_App_ChannelEvents_EventId",
                schema: "com",
                table: "T_App_ChannelEvents",
                column: "EventId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "T_App_ChannelEvents",
                schema: "com");

            migrationBuilder.AddColumn<string>(
                name: "ChannelId",
                schema: "com",
                table: "T_App_Event",
                type: "varchar(36)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_T_App_Event_ChannelId",
                schema: "com",
                table: "T_App_Event",
                column: "ChannelId");

            migrationBuilder.AddForeignKey(
                name: "FK_T_App_Event_T_App_Conversation_ChannelId",
                schema: "com",
                table: "T_App_Event",
                column: "ChannelId",
                principalSchema: "com",
                principalTable: "T_App_Conversation",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
