using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JobPortal.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIsBanned : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsBanned",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 999,
                columns: new[] { "IsBanned", "PasswordHash" },
                values: new object[] { false, "$2a$11$Z0Y40z7kbZ9kldIhHNHGhOGkeXgXENbTwv1oAVoKbHMp0ANEYzNB." });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsBanned",
                table: "Users");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 999,
                column: "PasswordHash",
                value: "$2a$11$/cGetJ21o9hBM4nv8aVG6OPB4MDnfEwq6HQAuvzmF74ngsG3ws8/u");
        }
    }
}
