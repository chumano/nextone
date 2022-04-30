using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ComService.Migrations
{
    public partial class Com_InitApplication : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "com");

            migrationBuilder.CreateTable(
                name: "T_App_Conversation",
                schema: "com",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    CreatedBy = table.Column<string>(type: "varchar(36)", nullable: true),
                    UpdatedDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedBy = table.Column<string>(type: "varchar(36)", nullable: true),
                    AllowedEventTypeCodes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_App_Conversation", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "T_App_EventType",
                schema: "com",
                columns: table => new
                {
                    Code = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(255)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_App_EventType", x => x.Code);
                });

            migrationBuilder.CreateTable(
                name: "T_App_UserStatus",
                schema: "com",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "varchar(36)", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    UserAvatarUrl = table.Column<string>(type: "nvarchar(255)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    LastUpdateDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    LastLat = table.Column<double>(type: "float", nullable: true),
                    LastLon = table.Column<double>(type: "float", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_App_UserStatus", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "T_App_ConversationMember",
                schema: "com",
                columns: table => new
                {
                    ConversationId = table.Column<string>(type: "varchar(36)", nullable: false),
                    UserId = table.Column<string>(type: "varchar(36)", nullable: false),
                    Role = table.Column<string>(type: "varchar(20)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_App_ConversationMember", x => new { x.ConversationId, x.UserId });
                    table.ForeignKey(
                        name: "FK_T_App_ConversationMember_T_App_Conversation_ConversationId",
                        column: x => x.ConversationId,
                        principalSchema: "com",
                        principalTable: "T_App_Conversation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_T_App_ConversationMember_T_App_UserStatus_UserId",
                        column: x => x.UserId,
                        principalSchema: "com",
                        principalTable: "T_App_UserStatus",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "T_App_Event",
                schema: "com",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EventTypeCode = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    OccurDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(255)", nullable: true),
                    Lat = table.Column<double>(type: "float", nullable: false),
                    Lon = table.Column<double>(type: "float", nullable: false),
                    ChannelId = table.Column<string>(type: "varchar(36)", nullable: false),
                    UserSenderId = table.Column<string>(type: "varchar(36)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_App_Event", x => x.Id);
                    table.ForeignKey(
                        name: "FK_T_App_Event_T_App_Conversation_ChannelId",
                        column: x => x.ChannelId,
                        principalSchema: "com",
                        principalTable: "T_App_Conversation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_T_App_Event_T_App_UserStatus_UserSenderId",
                        column: x => x.UserSenderId,
                        principalSchema: "com",
                        principalTable: "T_App_UserStatus",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "T_App_UserTrackingLocations",
                schema: "com",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "varchar(36)", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime", nullable: false),
                    Lat = table.Column<double>(type: "float", nullable: false),
                    Lon = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_App_UserTrackingLocations", x => new { x.UserId, x.Date });
                    table.ForeignKey(
                        name: "FK_T_App_UserTrackingLocations_T_App_UserStatus_UserId",
                        column: x => x.UserId,
                        principalSchema: "com",
                        principalTable: "T_App_UserStatus",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "T_App_EventFiles",
                schema: "com",
                columns: table => new
                {
                    EventId = table.Column<string>(type: "varchar(36)", nullable: false),
                    FileId = table.Column<string>(type: "varchar(36)", nullable: false),
                    FileType = table.Column<string>(type: "varchar(50)", nullable: true),
                    FileUrl = table.Column<string>(type: "nvarchar(255)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_App_EventFiles", x => new { x.EventId, x.FileId });
                    table.ForeignKey(
                        name: "FK_T_App_EventFiles_T_App_Event_EventId",
                        column: x => x.EventId,
                        principalSchema: "com",
                        principalTable: "T_App_Event",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "T_App_Message",
                schema: "com",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(36)", nullable: false),
                    ConversationId = table.Column<string>(type: "varchar(36)", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    SentDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    UserSenderId = table.Column<string>(type: "varchar(36)", nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EventId = table.Column<string>(type: "varchar(36)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_App_Message", x => x.Id);
                    table.ForeignKey(
                        name: "FK_T_App_Message_T_App_Conversation_ConversationId",
                        column: x => x.ConversationId,
                        principalSchema: "com",
                        principalTable: "T_App_Conversation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_T_App_Message_T_App_Event_EventId",
                        column: x => x.EventId,
                        principalSchema: "com",
                        principalTable: "T_App_Event",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_T_App_Message_T_App_UserStatus_UserSenderId",
                        column: x => x.UserSenderId,
                        principalSchema: "com",
                        principalTable: "T_App_UserStatus",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "T_App_MessageFiles",
                schema: "com",
                columns: table => new
                {
                    MessageId = table.Column<string>(type: "varchar(36)", nullable: false),
                    FileId = table.Column<string>(type: "varchar(36)", nullable: false),
                    FileType = table.Column<int>(type: "int", nullable: false),
                    FileUrl = table.Column<string>(type: "nvarchar(255)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_T_App_MessageFiles", x => new { x.MessageId, x.FileId });
                    table.ForeignKey(
                        name: "FK_T_App_MessageFiles_T_App_Message_MessageId",
                        column: x => x.MessageId,
                        principalSchema: "com",
                        principalTable: "T_App_Message",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_T_App_ConversationMember_UserId",
                schema: "com",
                table: "T_App_ConversationMember",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_T_App_Event_ChannelId",
                schema: "com",
                table: "T_App_Event",
                column: "ChannelId");

            migrationBuilder.CreateIndex(
                name: "IX_T_App_Event_UserSenderId",
                schema: "com",
                table: "T_App_Event",
                column: "UserSenderId");

            migrationBuilder.CreateIndex(
                name: "IX_T_App_Message_ConversationId",
                schema: "com",
                table: "T_App_Message",
                column: "ConversationId");

            migrationBuilder.CreateIndex(
                name: "IX_T_App_Message_EventId",
                schema: "com",
                table: "T_App_Message",
                column: "EventId",
                unique: true,
                filter: "[EventId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_T_App_Message_UserSenderId",
                schema: "com",
                table: "T_App_Message",
                column: "UserSenderId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "T_App_ConversationMember",
                schema: "com");

            migrationBuilder.DropTable(
                name: "T_App_EventFiles",
                schema: "com");

            migrationBuilder.DropTable(
                name: "T_App_EventType",
                schema: "com");

            migrationBuilder.DropTable(
                name: "T_App_MessageFiles",
                schema: "com");

            migrationBuilder.DropTable(
                name: "T_App_UserTrackingLocations",
                schema: "com");

            migrationBuilder.DropTable(
                name: "T_App_Message",
                schema: "com");

            migrationBuilder.DropTable(
                name: "T_App_Event",
                schema: "com");

            migrationBuilder.DropTable(
                name: "T_App_Conversation",
                schema: "com");

            migrationBuilder.DropTable(
                name: "T_App_UserStatus",
                schema: "com");
        }
    }
}
