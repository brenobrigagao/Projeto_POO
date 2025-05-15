using System.Security.Claims;
using System.Threading.Tasks;
using FFCE.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FFCE.DTOs;
using FFCE.Models;
using Microsoft.AspNetCore.SignalR.Protocol;

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
                Quantidade = dto.Quantidade,
                Preco = produto.Preco
            };
            _context.ItensCarrinho.Add(novoItem);
        }

        await _context.SaveChangesAsync();
        return Ok("Produto adicionado ao carrinho");
    }

    [HttpGet("ver-carrinho")]
    public async Task<IActionResult> VisualizarCarrinho(){
        var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var cliente = await _context.Clientes
        .Include(c => c.Carrinho)
            .ThenInclude(ca => ca.Itens)
                .ThenInclude(i => i.Produto)
                    .ThenInclude(p => p.Flor)
        .Include(c => c.Carrinho)
            .ThenInclude(ca => ca.Itens)
                .ThenInclude(i => i.Produto)
                    .ThenInclude(p => p.Produtor)
        .FirstOrDefaultAsync(c => c.UsuarioId == usuarioId);

        if(cliente == null || cliente.Carrinho == null) return NotFound("Carrinho não encontrado");

        var baseUrl = $"{Request.Scheme}://{Request.Host}/image/";

        var itens = cliente.Carrinho.Itens.Select(item => new{
            item.Id,
            ProdutoId = item.ProdutoId,
            Flor = item.Produto.Flor.Nome,
            ImageUrl = $"{baseUrl}{item.Produto.Flor.ImageName}",
            PrecoUnitario = item.Preco,
            Quantidade = item.Quantidade,
            Subtotal = item.Preco * item.Quantidade,
            Produtor = item.Produto.Produtor.Nome,
            NomeLoja = item.Produto.Produtor.NomeLoja,
            TelefoneProdutor = item.Produto.Produtor.Telefone 
        });

        var total = itens.Sum(i => i.Subtotal);
        return Ok(new
        {
            Itens = itens,
            Total = total
        });
    }
    }

    
}