namespace APPLICATION.DTOs;

public class ProdutoDisponivelDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = null!;
    public string Descricao { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;
    public decimal Preco { get; set; }
    public int Estoque { get; set; }
    public string NomeLoja { get; set; } = null!;
    public string  TelefoneLoja  { get; set; } = null!;
    public ProdutorInfoDto Produtor { get; set; } = null!;


}