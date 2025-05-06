using FFCE.Models;

public class Produto{
    public int Id{get;set;} 
    public int FlorId{get;set;}
    public Flor flor {get;set;} = null!;
    public int ProdutorId {get;set;}
    public Produtor produtor {get;set;} = null!;
    public decimal Preco {get;set;}
    public int Estoque {get;set;}
}