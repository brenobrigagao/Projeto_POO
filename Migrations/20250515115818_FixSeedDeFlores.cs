using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FFCE.Migrations
{
    /// <inheritdoc />
    public partial class FixSeedDeFlores : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Flores",
                keyColumn: "Id",
                keyValue: 1,
                column: "ImageName",
                value: "cactoempote.jpg");

            migrationBuilder.UpdateData(
                table: "Flores",
                keyColumn: "Id",
                keyValue: 2,
                column: "ImageName",
                value: "florbranca.jpg");

            migrationBuilder.UpdateData(
                table: "Flores",
                keyColumn: "Id",
                keyValue: 3,
                column: "ImageName",
                value: "rosavermelha.jpg");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Flores",
                keyColumn: "Id",
                keyValue: 1,
                column: "ImageName",
                value: "cacto em pote.jpg");

            migrationBuilder.UpdateData(
                table: "Flores",
                keyColumn: "Id",
                keyValue: 2,
                column: "ImageName",
                value: "flor branca.jpg");

            migrationBuilder.UpdateData(
                table: "Flores",
                keyColumn: "Id",
                keyValue: 3,
                column: "ImageName",
                value: "rosa-vermelha.jpg");
        }
    }
}
