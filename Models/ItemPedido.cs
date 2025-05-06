namespace FFCE.Models;

public class ItemPedido
{
    public int Id { get; set; }
    public int ProdutoId { get; set; }
    public Produto Produto { get; set; } = null!;

    public int Quantidade { get; set; }
    public decimal Preco { get; set; }
}
