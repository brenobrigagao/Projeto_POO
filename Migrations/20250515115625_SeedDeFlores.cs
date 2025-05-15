using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FFCE.Migrations
{
    /// <inheritdoc />
    public partial class SeedDeFlores : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Flores",
                columns: new[] { "Id", "Descricao", "ImageName", "Nome" },
                values: new object[,]
                {
                    { 1, "Cacto decorativo em vaso de cerâmica", "cacto em pote.jpg", "Cacto em Pote" },
                    { 2, "Flor de pétalas brancas, ideal para arranjos clean", "flor branca.jpg", "Flor Branca" },
                    { 3, "Clássica rosa vermelha, símbolo de paixão", "rosa-vermelha.jpg", "Rosa Vermelha" },
                    { 4, "Cacto pequeno, resistente e de fácil manutenção", "cacto.jpg", "Cacto Simples" },
                    { 5, "Girassol vibrante, traz alegria aos ambientes", "girassol.jpg", "Girassol" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Flores",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Flores",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Flores",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Flores",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Flores",
                keyColumn: "Id",
                keyValue: 5);
        }
    }
}
