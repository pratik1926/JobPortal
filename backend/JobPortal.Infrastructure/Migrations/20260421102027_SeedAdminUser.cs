using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPortal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "Name", "PasswordHash", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { 999, "admin@test.com", "", "AQAAAAIAAYagAAAAEBWseZpJs0g++RHrBEMqNNThr8ed6GKjMVDQ7sKnTLYMK+TeqpWwCjdj3g8u44S+Kw==", null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 999);
        }
    }
}
