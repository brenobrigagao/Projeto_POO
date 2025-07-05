namespace INFRA.Models
{
    public class Flor
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public string ImageName { get; set; }

        public ICollection<Produto> Produtos { get; set; } = new List<Produto>();
    }
}