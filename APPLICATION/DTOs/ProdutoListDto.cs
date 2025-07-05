using INFRA.Models;

namespace APPLICATION.DTOs;

public class ProdutoListDto
{
    public int     ProdutoId { get; set; }
    public string  Flor      { get; set; } = null!;
    public decimal Preco     { get; set; }
    public int     Estoque   { get; set; }
    public string  NomeLoja  { get; set; } = null!;
    public string  Telefone  { get; set; } = null!;
    public string  ImageUrl  { get; set; } = null!;

    public static ProdutoListDto FromEntity(Produto p, string baseUrl, Flor flor)
    {
        return new ProdutoListDto
        {
            ProdutoId = p.Id,
            Flor      = flor?.Nome ?? "Flor não carregada",
            Preco     = p.Preco,
            Estoque   = p.Estoque,
            NomeLoja  = p.Produtor?.NomeLoja ?? "Loja não carregada",
            Telefone  = p.Produtor?.Telefone ?? "Telefone não carregado",
            ImageUrl  = baseUrl + (flor?.ImageName ?? p.ImageName ?? "default.png")
        };
    }

}