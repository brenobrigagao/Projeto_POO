using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using System.Security.Claims;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using FFCE.Data;
using FFCE.Models;
using FFCE.DTOs;

namespace FFCE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Produtor")]
    public class ProdutorController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProdutorController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }
        [HttpGet("listar-flores")]
        public async Task<IActionResult> ListarFlores()
        {
            var flores = await _context.Flores
            .Select(f => new
            {
                f.Id,
                f.Nome,
                f.Descricao,
                 ImageUrl = $"{Request.Scheme}://{Request.Host}/images/{f.ImageName}"
            })
            .ToListAsync();
            return Ok(flores);
        }
        [HttpPost("cadastrar-produto")]
        public async Task<IActionResult> CadastrarProduto([FromBody] ProdutoCadastroDTO dto)
        {
            var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var produtor = await _context.Produtores
                .FirstOrDefaultAsync(p => p.UsuarioId == usuarioId);
            if (produtor == null)
                return BadRequest("Produtor não encontrado.");

            var flor = await _context.Flores
                .FirstOrDefaultAsync(f => f.Id == dto.FlorId);
            if (flor == null)
                return BadRequest("Flor inválida.");

            var imagesFolder = Path.Combine(_env.WebRootPath, "images");
            var imagePath = Path.Combine(imagesFolder, flor.ImageName);
            if (!System.IO.File.Exists(imagePath))
                return BadRequest("Imagem selecionada não encontrada.");

            var produto = new Produto
            {
                FlorId     = dto.FlorId,
                ProdutorId = produtor.Id,
                Preco      = dto.Preco,
                Estoque    = dto.Estoque,
            };

            _context.Produtos.Add(produto);
            await _context.SaveChangesAsync();

            return Ok("Produto cadastrado com sucesso.");
        }

        [HttpGet("meus-produtos")]
        public async Task<IActionResult> MeusProdutos()
        {
            var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var produtor = await _context.Produtores
                .Include(p => p.Produtos)
                    .ThenInclude(pr => pr.Flor)
                .FirstOrDefaultAsync(p => p.UsuarioId == usuarioId);

            if (produtor == null)
                return BadRequest("Produtor não encontrado.");

            var baseUrl = $"{Request.Scheme}://{Request.Host}/images/";

            var resultado = produtor.Produtos.Select(p => new
            {
                p.Id,
                Flor      = p.Flor.Nome,
                p.Preco,
                p.Estoque,
                ImageUrl  = $"{baseUrl}{p.Flor.ImageName}"
            });

            return Ok(resultado);
        }

        [HttpPut("editar-produto/{id}")]
        public async Task<IActionResult> EditarProduto(int id, [FromBody] ProdutoAtualizaDTO dto)
        {
            var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var produto = await _context.Produtos
                .Include(p => p.Produtor)
                .FirstOrDefaultAsync(p => p.Id == id && p.Produtor.UsuarioId == usuarioId);

            if (produto == null)
                return NotFound("Produto não encontrado ou acesso negado.");

            if (dto.Preco.HasValue)
                produto.Preco = dto.Preco.Value;
            if (dto.Estoque.HasValue)
                produto.Estoque = dto.Estoque.Value;

            if (dto.FlorId.HasValue)
            {
                var flor = await _context.Flores
                    .FirstOrDefaultAsync(f => f.Id == dto.FlorId.Value);
                if (flor == null)
                    return BadRequest("Flor inválida.");

                    var imagesFolder = Path.Combine(_env.WebRootPath, "images");
                    var imagePath = Path.Combine(imagesFolder, flor.ImageName);
                if (!System.IO.File.Exists(imagePath))
                    return BadRequest("Imagem da flor não encontrada.");
                produto.FlorId = dto.FlorId.Value;
            }

            _context.Produtos.Update(produto);
            await _context.SaveChangesAsync();

            return Ok("Produto atualizado com sucesso.");
        }

        [HttpDelete("excluir-produto/{id}")]
        public async Task<IActionResult> ExcluirProduto(int id)
        {
            var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var produto = await _context.Produtos
                .Include(p => p.Produtor)
                .FirstOrDefaultAsync(p => p.Id == id && p.Produtor.UsuarioId == usuarioId);

            if (produto == null)
                return NotFound("Produto não encontrado ou acesso negado.");

            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();

            return Ok("Produto excluído com sucesso.");
        }
    }
}
