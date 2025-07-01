using INFRA.Models;

namespace FFCE.Application.DTOs
{
    

public class ProdutorCreateDto
{
    public string Email { get; set; } = null!;
    public string Senha { get; set; } = null!;
    public string Nome { get; set; } = null!;
    public string Telefone { get; set; } = null!;
    public string Endereco { get; set; } = null!;
    public string NomeLoja { get; set; } = null!;
    public string Descricao { get; set; } = null!;

    public static Produtor ToEntity(ProdutorCreateDto dto) =>
        new Produtor
        {
            Email = dto.Email,
            SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha),
            Nome = dto.Nome,
            Telefone = dto.Telefone,
            Endereco = dto.Endereco,
            NomeLoja = dto.NomeLoja,
            Descricao = dto.Descricao
        };
}
}