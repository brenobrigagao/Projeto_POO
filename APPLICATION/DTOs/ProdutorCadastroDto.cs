using INFRA.Models;

namespace APPLICATION.DTOs;

public class ProdutoCadastroDto
{
    public int FlorId { get; set; }
    public decimal Preco { get; set; }
    public int Estoque { get; set; }

    public static Produto ToEntity(int produtorId, ProdutoCadastroDto dto, string imageName) =>
        new Produto
        {
            FlorId = dto.FlorId,
            ProdutorId = produtorId,
            Preco = dto.Preco,
            Estoque = dto.Estoque,
            ImageName = imageName
        };
}