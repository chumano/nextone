using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ComService.Migrations
{
    public partial class Com_SubChannel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AncestorIds",
                schema: "com",
                table: "T_App_Conversation",
                type: "nvarchar(255)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ChannelLevel",
                schema: "com",
                table: "T_App_Conversation",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ParentId",
                schema: "com",
                table: "T_App_Conversation",
                type: "varchar(36)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AncestorIds",
                schema: "com",
                table: "T_App_Conversation");

            migrationBuilder.DropColumn(
                name: "ChannelLevel",
                schema: "com",
                table: "T_App_Conversation");

            migrationBuilder.DropColumn(
                name: "ParentId",
                schema: "com",
                table: "T_App_Conversation");
        }
    }
}
