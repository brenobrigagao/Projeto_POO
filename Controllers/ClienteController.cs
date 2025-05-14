using System.Security.Claims;
using System.Threading.Tasks;
using FFCE.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FFCE.DTOs;
using FFCE.Models;

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
        [HttpPost("adicionar-carrinho")]
        public async Task<IActionResult> AdicionarAoCarrinho(AddCarrinhoDTO dto)
        {
        var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var cliente = await _context.Clientes
        .Include(c => c.Carrinho)
        .FirstOrDefaultAsync(c => c.UsuarioId == usuarioId);
        
        var produto = await _context.Produtos.FindAsync(dto.ProdutoId);
        
        if(produto == null) return NotFound("Produto não encontrado");
        
        if(dto.Quantidade <= 0) return BadRequest("Quantidade inválida");
        
        var itemExistente = await _context.ItensCarrinho
        .FirstOrDefaultAsync(i => i.CarrinhoId == cliente.Carrinho.Id && i.ProdutoId == dto.ProdutoId);
        
        if(itemExistente != null)
        {
            itemExistente.Quantidade += dto.Quantidade;
        }
        else
        {
            var novoItem = new ItemCarrinho {
                CarrinhoId = cliente.Carrinho.Id,
                ProdutoId = dto.ProdutoId,
                Quantidade = dto.Quantidade
            };
            _context.ItensCarrinho.Add(novoItem);
        }

        await _context.SaveChangesAsync();
        return Ok("Produto adicionado ao carrinho");
        }
    }

    
}