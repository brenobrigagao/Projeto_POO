namespace FFCE.DTOs
{
    public class RegistroDTO
    {
        public string Email { get; set; } = null!;
        public string Senha { get; set; } = null!;
        public string Role { get; set; } = null!; // "Produtor" ou "Cliente"
    }
}