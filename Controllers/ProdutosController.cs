using System.Security.Claims;
using System.Threading.Tasks;
using FFCE.Data;
using FFCE.DTOs;
using FFCE.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FFCE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Produtor")]
    public class ProdutosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProdutosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProdutoDTO dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var produtor = await _context.Produtores
                .FirstOrDefaultAsync(p => p.UsuarioId == userId);
            if (produtor == null) return Forbid();

            int florId;
            if (dto.FlorId.HasValue)
            {
                var florExistente = await _context.Flores.FindAsync(dto.FlorId.Value);
                if (florExistente != null) florId = florExistente.Id;
                else if (!string.IsNullOrWhiteSpace(dto.FlorNome))
                {
                    var novaFlor = new Flor { Nome = dto.FlorNome!.Trim() };
                    _context.Flores.Add(novaFlor);
                    await _context.SaveChangesAsync();
                    florId = novaFlor.Id;
                }
                else return BadRequest("Flor não encontrada e nenhum nome fornecido.");
            }
            else if (!string.IsNullOrWhiteSpace(dto.FlorNome))
            {
                var novaFlor = new Flor { Nome = dto.FlorNome!.Trim() };
                _context.Flores.Add(novaFlor);
                await _context.SaveChangesAsync();
                florId = novaFlor.Id;
            }
            else return BadRequest("Informe FlorId ou FlorNome.");

            var produto = new Produto
            {
                FlorId = florId,
                Preco = dto.Preco,
                Estoque = dto.Estoque,
                ProdutorId = produtor.Id
            };
            _context.Produtos.Add(produto);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = produto.Id }, new
            {
                produto.Id,
                produto.FlorId,
                produto.Preco,
                produto.Estoque,
                produto.ProdutorId
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var produtos = await _context.Produtos
                .Where(p => p.Produtor.UsuarioId == userId)
                .Select(p => new
                {
                    p.Id,
                    p.FlorId,
                    p.Preco,
                    p.Estoque
                })
                .ToListAsync();

            return Ok(produtos);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var p = await _context.Produtos
                .FirstOrDefaultAsync(x => x.Id == id && x.Produtor.UsuarioId == userId);
            if (p == null) return NotFound();
            return Ok(new { p.Id, p.FlorId, p.Preco, p.Estoque });
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProdutoDTO dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var produto = await _context.Produtos
                .FirstOrDefaultAsync(x => x.Id == id && x.Produtor.UsuarioId == userId);
            if (produto == null) return NotFound();

            int florId = produto.FlorId;
            if (dto.FlorId.HasValue)
            {
                var florExist = await _context.Flores.FindAsync(dto.FlorId.Value);
                if (florExist != null) florId = florExist.Id;
                else if (!string.IsNullOrWhiteSpace(dto.FlorNome))
                {
                    var nova = new Flor { Nome = dto.FlorNome!.Trim() };
                    _context.Flores.Add(nova);
                    await _context.SaveChangesAsync();
                    florId = nova.Id;
                }
                else return BadRequest("Flor não encontrada e nenhum nome fornecido.");
            }
            else if (!string.IsNullOrWhiteSpace(dto.FlorNome))
            {
                var nova = new Flor { Nome = dto.FlorNome!.Trim() };
                _context.Flores.Add(nova);
                await _context.SaveChangesAsync();
                florId = nova.Id;
            }

            produto.FlorId = florId;
            produto.Preco = dto.Preco;
            produto.Estoque = dto.Estoque;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var produto = await _context.Produtos
                .FirstOrDefaultAsync(x => x.Id == id && x.Produtor.UsuarioId == userId);
            if (produto == null) return NotFound();

            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
