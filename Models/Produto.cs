using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FFCE.Models
{
    public class Produto
    {
        public int Id { get; set; }

        public int FlorId { get; set; }

        public Flor Flor { get; set; } = default!;

        public int ProdutorId { get; set; }

        public Produtor Produtor { get; set; } = default!;

        public decimal Preco { get; set; }
        public int Estoque { get; set; }

        public string ImageName { get; set; } = null!;
        
        
    }
}