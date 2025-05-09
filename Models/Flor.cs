namespace FFCE.Models
{
    public class Flor
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public List<Produto> Produtos { get; set; } = new List<Produto>();
    }
}