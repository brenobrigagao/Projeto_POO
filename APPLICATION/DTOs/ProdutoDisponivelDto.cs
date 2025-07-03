namespace APPLICATION.DTOs;

public class ProdutoDisponivelDto
{
    public int     Id         { get; set; }
    public string  Nome       { get; set; } = null!;
    public string  Descricao  { get; set; } = null!;
    public string  ImageUrl   { get; set; } = null!;
    public decimal Preco      { get; set; }
    public int     Estoque    { get; set; }
}