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
    }
}