using INFRA.Models;

namespace FFCE.Application.DTOs
{

    public class ProdutoAtualizaDto
    {
        public decimal? Preco { get; set; }
        public int? Estoque { get; set; }
        public int? FlorId { get; set; }

        public static void Apply(Produto entity, ProdutoAtualizaDto dto, string? imageName = null)
        {
            if (dto.Preco.HasValue) entity.Preco = dto.Preco.Value;
            if (dto.Estoque.HasValue) entity.Estoque = dto.Estoque.Value;
            if (dto.FlorId.HasValue && imageName is not null)
            {
                entity.FlorId = dto.FlorId.Value;
                entity.ImageName = imageName;
            }
        }
    }
}