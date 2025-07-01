using INFRA.Models;

namespace FFCE.Application.DTOs
{

    public class AddCarrinhoDto
    {
        public int ProdutoId { get; set; }
        public int Quantidade { get; set; }

        public static ItemCarrinho ToEntity(int carrinhoId, AddCarrinhoDto dto, decimal preco) =>
            new ItemCarrinho
            {
                CarrinhoId = carrinhoId,
                ProdutoId = dto.ProdutoId,
                Quantidade = dto.Quantidade,
                Preco = preco
            };
    }
}