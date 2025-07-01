namespace APPLICATION.DTOs
{
    public class CarrinhoItemDto
    {
        public int Id { get; set; }
        public int ProdutoId { get; set; }
        public string Flor { get; set; } = null!;
        public string ImageUrl { get; set; } = null!;
        public decimal PrecoUnitario { get; set; }
        public int Quantidade { get; set; }
        public decimal Subtotal { get; set; }
        public string Produtor { get; set; } = null!;
        public string NomeLoja { get; set; } = null!;
        public string TelefoneProdutor { get; set; } = null!;
    }

    public class CarrinhoViewDto
    {
        public IEnumerable<CarrinhoItemDto> Itens { get; set; } = null!;
        public decimal Total { get; set; }
    }
}