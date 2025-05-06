namespace FFCE.Models;
public class Carrinho
{
    public int Id { get; set; }

    public int ClienteId { get; set; }
    public Cliente Cliente { get; set; } = null!;

    public List<ItemCarrinho> Itens { get; set; } = new();
}
