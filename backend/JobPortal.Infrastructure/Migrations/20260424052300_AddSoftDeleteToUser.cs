using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPortal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSoftDeleteToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 999,
                column: "PasswordHash",
                value: "$2a$11$CY67AK1MXEMNYfDGBXiRveKpYXbdr8FaKK4C55I44vBAiARF1OkE2");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 999,
                column: "PasswordHash",
                value: "AQAAAAIAAYagAAAAEIkvqIZWgQYGMqCOcM/CEPlqhh1AHV98cjgADdcVXOGgpQpFb0xc2IqM0eRcLCA6/A==");
        }
    }
}
