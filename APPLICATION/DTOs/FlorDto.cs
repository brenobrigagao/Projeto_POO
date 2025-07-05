using INFRA.Models;

namespace APPLICATION.DTOs;

public class FlorDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = null!;
    public string Descricao { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;

    public static FlorDto FromEntity(Flor f, string baseUrl) =>
        new FlorDto
        {
            Id = f.Id,
            Nome = f.Nome,
            Descricao = f.Descricao,
            ImageUrl = $"{baseUrl}{f.ImageName}"
        };
}