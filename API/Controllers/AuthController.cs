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
    public class AuthController : ControllerBase
    {
        private readonly AuthService _auth;

        public AuthController(AuthService auth)
        {
            _auth = auth;
        }

        [HttpPost("registro-cliente")]
        public async Task<IActionResult> RegistroCliente([FromBody] ClienteCreateDto dto)
        {
            var id = await _auth.RegisterClienteAsync(dto);
            return Ok(new { message = "Cliente registrado com sucesso!", id });
        }

        [HttpPost("registro-produtor")]
        public async Task<IActionResult> RegistroProdutor([FromBody] ProdutorCreateDto dto)
        {
            var id = await _auth.RegisterProdutorAsync(dto);
            return Ok(new { message = "Produtor registrado com sucesso!", id });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            try
            {
                var (token, role, id) = await _auth.LoginAsync(dto);
                return Ok(new { token, role, id });
            }
            catch
            {
                return Unauthorized("Credenciais inválidas!");
            }
        }

        [Authorize]
        [HttpGet("verificar")]
        public async Task<IActionResult> VerificarCadastro()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var role   = User.FindFirst(ClaimTypes.Role)!.Value;
            var completo = await _auth.VerificarCadastroAsync(userId, role);
            return Ok(new { cadastroCompleto = completo });
        }
    }
}