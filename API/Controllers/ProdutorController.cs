using System.Security.Claims;
using System.Threading.Tasks;
using APPLICATION.DTOs;
using APPLICATION.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FFCE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Produtor")]
    public class ProdutorController : ControllerBase
    {
        private readonly ProdutorService _service;

        public ProdutorController(ProdutorService service)
        {
            _service = service;
        }

        [HttpGet("listar-flores")]
        public async Task<IActionResult> ListarFlores()
        {
            var flores = await _service.ListarFloresAsync();
            return Ok(flores);
        }

        [HttpPost("cadastrar-produto")]
        public async Task<IActionResult> CadastrarProduto([FromBody] ProdutoCadastroDto dto)
        {
            var produtorId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            try
            {
                await _service.CadastrarProdutoAsync(produtorId, dto);
                return Ok("Produto cadastrado com sucesso.");
            }
            catch (FileNotFoundException)
            {
                return BadRequest("Imagem selecionada não encontrada.");
            }
            catch
            {
                return BadRequest("Não foi possível cadastrar o produto.");
            }
        }

        [HttpGet("meus-produtos")]
        public async Task<IActionResult> MeusProdutos()
        {
            var produtorId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var lista = await _service.MeusProdutosAsync(produtorId);
            return Ok(lista);
        }

        [HttpPut("editar-produto/{id}")]
        public async Task<IActionResult> EditarProduto(int id, [FromBody] ProdutoAtualizaDto dto)
        {
            var produtorId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            try
            {
                await _service.EditarProdutoAsync(produtorId, id, dto);
                return Ok("Produto atualizado com sucesso.");
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Produto não encontrado ou acesso negado.");
            }
            catch (FileNotFoundException)
            {
                return BadRequest("Imagem da flor não encontrada.");
            }
            catch
            {
                return BadRequest("Não foi possível atualizar o produto.");
            }
        }

        [HttpDelete("excluir-produto/{id}")]
        public async Task<IActionResult> ExcluirProduto(int id)
        {
            var produtorId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            try
            {
                await _service.ExcluirProdutoAsync(produtorId, id);
                return Ok("Produto excluído com sucesso.");
            }
            catch
            {
                return NotFound("Produto não encontrado ou acesso negado.");
            }
        }
    }
}
