using System.Security.Claims;
using APPLICATION.DTOs;
using APPLICATION.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FFCE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Cliente")]
    public class ClienteController : ControllerBase
    {
        private readonly ClienteService _service;

        public ClienteController(ClienteService service)
        {
            _service = service;
        }

        [HttpGet("produtos-disponiveis")]
        public async Task<IActionResult> ListarProdutos()
        {
            var lista = await _service.ListarProdutosAsync();
            return Ok(lista);
        }

        [HttpPost("adicionar-carrinho")]
        public async Task<IActionResult> AdicionarAoCarrinho([FromBody] AddCarrinhoDto dto)
        {
            var clienteId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            try
            {
                await _service.AdicionarAoCarrinhoAsync(clienteId, dto);
                return Ok("Produto adicionado ao carrinho.");
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Cliente ou produto não encontrado.");
            }
            catch
            {
                return BadRequest("Não foi possível adicionar ao carrinho.");
            }
        }

        [HttpGet("ver-carrinho")]
        public async Task<IActionResult> VisualizarCarrinho()
        {
            var clienteId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            try
            {
                var carrinho = await _service.VisualizarCarrinhoAsync(clienteId);
                return Ok(carrinho);
            }
            catch
            {
                return NotFound("Carrinho não encontrado.");
            }
        }

        [HttpPut("atualizar-quantidade")]
        public async Task<IActionResult> AtualizarQuantidade([FromBody] AtualizarQuantidadeDto dto)
        {
            var clienteId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            try
            {
                await _service.AtualizarQuantidadeAsync(clienteId, dto.ProdutoId, dto.Quantidade);
                return Ok();
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Cliente ou item não encontrado.");
            }
            catch
            {
                return BadRequest("Não foi possível atualizar a quantidade.");
            }
        }

        [HttpDelete("remover-carrinho/{produtoId}")]
        public async Task<IActionResult> RemoverDoCarrinho(int produtoId)
        {
            var clienteId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            try
            {
                await _service.RemoverDoCarrinhoAsync(clienteId, produtoId);
                return Ok();
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Cliente ou item não encontrado.");
            }
            catch
            {
                return BadRequest("Não foi possível remover o item.");
            }
        }

        [HttpPost("finalizar-compra")]
        public async Task<IActionResult> FinalizarCompra()
        {
            var clienteId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            try
            {
                await _service.FinalizarCompraAsync(clienteId);
                return Ok("Compra finalizada com sucesso.");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch
            {
                return BadRequest("Não foi possível finalizar a compra.");
            }
        }
    }
}