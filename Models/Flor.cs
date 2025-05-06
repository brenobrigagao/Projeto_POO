using FFCE.Models;

public class Flor{
    public int Id {get;set;}
    public string Nome {get;set;} = string.Empty;
    public string Descricao {get;set;} = string.Empty;
    public List<Produtor> Produtos {get;set;} = new();

}