namespace FFCE.DTOs;

public class ProdutoCadastroDTO
{
        public int    FlorId    { get; set; }
        public decimal Preco    { get; set; }
        public int    Estoque   { get; set; }
        public string ImageName { get; set; }  // Nome do arquivo em wwwroot/images
    
}