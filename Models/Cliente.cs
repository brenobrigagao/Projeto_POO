namespace FFCE.Models;

public class Cliente{
    public int Id {get;set;}
    public string Nome {get;set;} = string.Empty;

    public int UsuarioId {get;set;}
    public Usuario usuario {get;set;} = null!;
    public Carrinho carrinho {get;set;} = null!;
}