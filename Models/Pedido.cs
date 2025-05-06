namespace FFCE.Models;
public class Pedido
{
    public int Id { get; set; }
    public int ClienteId { get; set; }
    public Cliente Cliente { get; set; } = null!;

    public DateTime DataPedido { get; set; }
    public decimal Total { get; set; }

    public List<ItemPedido> Itens { get; set; } = new();
}
