using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace web_api.Migrations
{
    public partial class RenameUserCarrinhoToUserCart : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("EXEC sp_rename 'UserCarrinhos', 'UserCarts'");
            
            migrationBuilder.Sql("EXEC sp_rename 'PK_UserCarrinhos', 'PK_UserCarts'");
            
            migrationBuilder.Sql("EXEC sp_rename 'FK_UserCarrinhos_Items_ItemId', 'FK_UserCarts_Items_ItemId'");
            migrationBuilder.Sql("EXEC sp_rename 'FK_UserCarrinhos_Users_UserId', 'FK_UserCarts_Users_UserId'");
            
            migrationBuilder.Sql("EXEC sp_rename 'UserCarts.IX_UserCarrinhos_ItemId', 'IX_UserCarts_ItemId', 'INDEX'");
            migrationBuilder.Sql("EXEC sp_rename 'UserCarts.IX_UserCarrinhos_UserId_ItemId', 'IX_UserCarts_UserId_ItemId', 'INDEX'");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("EXEC sp_rename 'UserCarts.IX_UserCarts_ItemId', 'IX_UserCarrinhos_ItemId', 'INDEX'");
            migrationBuilder.Sql("EXEC sp_rename 'UserCarts.IX_UserCarts_UserId_ItemId', 'IX_UserCarrinhos_UserId_ItemId', 'INDEX'");
            migrationBuilder.Sql("EXEC sp_rename 'FK_UserCarts_Items_ItemId', 'FK_UserCarrinhos_Items_ItemId'");
            migrationBuilder.Sql("EXEC sp_rename 'FK_UserCarts_Users_UserId', 'FK_UserCarrinhos_Users_UserId'");
            migrationBuilder.Sql("EXEC sp_rename 'PK_UserCarts', 'PK_UserCarrinhos'");
            migrationBuilder.Sql("EXEC sp_rename 'UserCarts', 'UserCarrinhos'");
        }
    }
}
