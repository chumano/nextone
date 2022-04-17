using Microsoft.EntityFrameworkCore.Migrations;

namespace MasterService.Migrations
{
    public partial class Master_Init_DB : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "master");

            migrationBuilder.CreateTable(
                name: "Permission",
                schema: "master",
                columns: table => new
                {
                    Code = table.Column<string>(type: "varchar(50)", nullable: false),
                    Name = table.Column<string>(type: "varchar(255)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permission", x => x.Code);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                schema: "master",
                columns: table => new
                {
                    Code = table.Column<string>(type: "varchar(20)", nullable: false),
                    Name = table.Column<string>(type: "varchar(255)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.Code);
                });

            migrationBuilder.CreateTable(
                name: "User",
                schema: "master",
                columns: table => new
                {
                    Id = table.Column<string>(type: "char(16)", nullable: false),
                    Name = table.Column<string>(type: "varchar(255)", nullable: false),
                    Email = table.Column<string>(type: "varchar(255)", nullable: true),
                    Phone = table.Column<string>(type: "varchar(20)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RolePermission",
                schema: "master",
                columns: table => new
                {
                    RoleCode = table.Column<string>(type: "varchar(20)", nullable: false),
                    PermissionCode = table.Column<string>(type: "varchar(50)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolePermission", x => new { x.RoleCode, x.PermissionCode });
                    table.ForeignKey(
                        name: "FK_RolePermission_Permission_PermissionCode",
                        column: x => x.PermissionCode,
                        principalSchema: "master",
                        principalTable: "Permission",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RolePermission_Role_RoleCode",
                        column: x => x.RoleCode,
                        principalSchema: "master",
                        principalTable: "Role",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRole",
                schema: "master",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "char(16)", nullable: false),
                    RoleCode = table.Column<string>(type: "varchar(20)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRole", x => new { x.UserId, x.RoleCode });
                    table.ForeignKey(
                        name: "FK_UserRole_Role_RoleCode",
                        column: x => x.RoleCode,
                        principalSchema: "master",
                        principalTable: "Role",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRole_User_UserId",
                        column: x => x.UserId,
                        principalSchema: "master",
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RolePermission_PermissionCode",
                schema: "master",
                table: "RolePermission",
                column: "PermissionCode");

            migrationBuilder.CreateIndex(
                name: "IX_UserRole_RoleCode",
                schema: "master",
                table: "UserRole",
                column: "RoleCode");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RolePermission",
                schema: "master");

            migrationBuilder.DropTable(
                name: "UserRole",
                schema: "master");

            migrationBuilder.DropTable(
                name: "Permission",
                schema: "master");

            migrationBuilder.DropTable(
                name: "Role",
                schema: "master");

            migrationBuilder.DropTable(
                name: "User",
                schema: "master");
        }
    }
}
