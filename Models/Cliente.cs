namespace FFCE.Models
{
    public class Cliente
    {
        public int    Id        { get; set; }
        public int    UsuarioId { get; set; }
        public Usuario Usuario  { get; set; } = null!;

        public string Nome      { get; set; } = null!;
        public string Telefone  { get; set; } = null!;
        public string Endereco  { get; set; } = null!;
        public string Gostos    { get; set; } = null!;

        public Carrinho Carrinho { get; set; } = null!;
    }
}