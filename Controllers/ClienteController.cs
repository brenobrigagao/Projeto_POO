using System.Security.Claims;
using System.Threading.Tasks;
using FFCE.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FFCE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Cliente")]
    public class ClienteController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ClienteController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("produtos-disponiveis")]
        public async Task<IActionResult> ListarProdutos()
        {
            var produtos = await _context.Produtos
                .Include(p => p.Flor)
                .Include(p => p.Produtor)
                .Select(p => new
                {
                    ProdutoId = p.Id,
                    Flor = p.Flor.Nome,
                    Preco = p.Preco,
                    Estoque = p.Estoque,
                    NomeLoja = p.Produtor.NomeLoja,
                    ProdutorTelefone = p.Produtor.Telefone
                })
                .ToListAsync();

            return Ok(produtos);
        }
    }
}