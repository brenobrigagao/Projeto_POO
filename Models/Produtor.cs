namespace FFCE.Models;

public class Produtor{
    public int Id {get;set;}
    public string Nome {get;set;} = string.Empty;
    public string Telefone {get;set;} = string.Empty;
    public string Endereco {get;set;} = string.Empty;

    public int UsuarioId {get;set;}
    public Usuario Usuario {get;set;} = null!;

    public List<Produto> Produtos{get;set;} = null!;
}