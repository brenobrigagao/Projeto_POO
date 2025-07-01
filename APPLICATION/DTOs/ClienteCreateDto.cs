

using INFRA.Models;

namespace FFCE.Application.DTOs
{

    public class ClienteCreateDto
    {
        public string Email { get; set; } = null!;
        public string Senha { get; set; } = null!;
        public string Nome { get; set; } = null!;
        public string Telefone { get; set; } = null!;
        public string Endereco { get; set; } = null!;
        public string Gostos { get; set; } = null!;

        public static Cliente ToEntity(ClienteCreateDto dto) =>
            new Cliente
            {
                Email = dto.Email,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha),
                Nome = dto.Nome,
                Telefone = dto.Telefone,
                Endereco = dto.Endereco,
                Gostos = dto.Gostos,
                Carrinho = new Carrinho()
            };
    }
}