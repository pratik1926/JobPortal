using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPortal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIsDeletedColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 999,
                columns: new[] { "IsDeleted", "PasswordHash" },
                values: new object[] { false, "$2a$11$wPQyRRYOtYrrM/ptbSSBxu/31EdyLVvCXklD4EaJGVk5dTeLw9Dq2" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Users");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 999,
                column: "PasswordHash",
                value: "$2a$11$CY67AK1MXEMNYfDGBXiRveKpYXbdr8FaKK4C55I44vBAiARF1OkE2");
        }
    }
}
