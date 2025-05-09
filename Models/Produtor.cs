using System.Text.Json.Serialization;

namespace FFCE.Models
{
    public class Produtor
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
        public string Endereco { get; set; } = string.Empty;
        public string NomeLoja { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;

        public int UsuarioId { get; set; }
        [JsonIgnore]
        public Usuario Usuario { get; set; } = null!;

        [JsonIgnore]
        public List<Produto> Produtos { get; set; } = new List<Produto>();
    }
}