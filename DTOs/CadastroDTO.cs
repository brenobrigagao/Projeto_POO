namespace FFCE.DTOs
{
    public class CadastroDTO
    {
        public string Nome     { get; set; } = null!;
        public string Telefone { get; set; } = null!;
        public string Endereco { get; set; } = null!;

        public string? NomeLoja  { get; set; }
        public string? Descricao { get; set; }

        public string? Gostos    { get; set; }
    }
}