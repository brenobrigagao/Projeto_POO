using INFRA.Models;

namespace FFCE.Application.DTOs
{

    public class ProdutoListDto
    {
        public int ProdutoId { get; set; }
        public string Flor { get; set; } = null!;
        public decimal Preco { get; set; }
        public int Estoque { get; set; }
        public string NomeLoja { get; set; } = null!;
        public string Telefone { get; set; } = null!;

        public static ProdutoListDto FromEntity(Produto p) =>
            new ProdutoListDto
            {
                ProdutoId = p.Id,
                Flor = p.Flor.Nome,
                Preco = p.Preco,
                Estoque = p.Estoque,
                NomeLoja = p.Produtor.NomeLoja,
                Telefone = p.Produtor.Telefone
            };
    }
}