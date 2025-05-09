using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FFCE.Models
{
    public class Produto
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int FlorId { get; set; }
        public decimal Preco { get; set; }
        public int Estoque { get; set; }

        public int ProdutorId { get; set; }
        public Produtor Produtor { get; set; }

        public Flor Flor { get; set; }
    }
}