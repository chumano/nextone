using Microsoft.EntityFrameworkCore.Migrations;

namespace MasterService.Migrations
{
    public partial class Master_AddUpdateUserNameTrigger : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
CREATE OR ALTER TRIGGER [master].update_user_status_name ON [master].[User]
AFTER UPDATE
AS
BEGIN
	UPDATE [com].[T_App_UserStatus]
    SET    [com].[T_App_UserStatus].UserName = [INSERTED].Name
    FROM   INSERTED
    WHERE  INSERTED.Id = [com].[T_App_UserStatus].UserId
END
"
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
DROP TRIGGER [master].update_user_status_name"
            );
        }
    }
}
