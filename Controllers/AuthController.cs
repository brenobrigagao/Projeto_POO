using System.Security.Claims;
using BCrypt.Net;
using FFCE.Data;
using FFCE.DTOs;
using FFCE.Models;
using FFCE.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FFCE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly TokenService _tokenService;

        public AuthController(AppDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        [HttpPost("registrar")]
        public async Task<IActionResult> Registro([FromBody] RegistroDTO dto)
        {
            var exists = await _context.Usuarios.AnyAsync(u => u.Email == dto.Email);
            if (exists)
                return BadRequest("Email já cadastrado.");

            var usuario = new Usuario
            {
                Email     = dto.Email,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha),
                Role      = dto.Role
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { message = "O usuário foi registrado com sucesso!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO dto)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (usuario == null || !BCrypt.Net.BCrypt.Verify(dto.Senha, usuario.SenhaHash))
                return Unauthorized("Credenciais inválidas!");

            var token = _tokenService.GenerateToken(usuario);

            return Ok(new
            {
                token,
                role = usuario.Role,
                id   = usuario.Id
            });
        }

        
        [Authorize]
        [HttpPost("cadastro")]
        public async Task<IActionResult> Cadastro([FromBody] CadastroDTO dto)
        {
            var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var usuario = await _context.Usuarios.FindAsync(usuarioId);
            if (usuario == null)
                return NotFound("Usuário não encontrado!");

            if (usuario.Role == "Produtor")
            {
                var produtor = new Produtor
                {
                    Nome       = dto.Nome,
                    Telefone   = dto.Telefone,
                    Endereco   = dto.Endereco,
                    NomeLoja   = dto.NomeLoja!,
                    Descricao  = dto.Descricao!,
                    UsuarioId  = usuarioId
                };
                _context.Produtores.Add(produtor);
            }
            else if (usuario.Role == "Cliente")
            {
                var cliente = new Cliente
                {
                    Nome       = dto.Nome,
                    Telefone   = dto.Telefone,
                    Endereco   = dto.Endereco,
                    Gostos     = dto.Gostos!,
                    UsuarioId  = usuarioId,
                    Carrinho   = new Carrinho()  // EF vai popular ClienteId automaticamente
                };
                _context.Clientes.Add(cliente);
            }
            else
            {
                return BadRequest("Role inválida para cadastro complementar.");
            }

            await _context.SaveChangesAsync();
            return Ok("Cadastro completo com sucesso!");
        }

        
        [Authorize]
        [HttpGet("verificar")]
        public async Task<IActionResult> VerificarCadastro()
        {
            var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var usuario = await _context.Usuarios.FindAsync(usuarioId);
            if (usuario == null)
                return NotFound("Usuário não encontrado!");

            bool cadastroCompleto;
            if (usuario.Role == "Produtor")
            {
                cadastroCompleto = await _context.Produtores
                    .AnyAsync(p => p.UsuarioId == usuarioId);
            }
            else if (usuario.Role == "Cliente")
            {
                cadastroCompleto = await _context.Clientes
                    .AnyAsync(c => c.UsuarioId == usuarioId);
            }
            else
            {
                return BadRequest("Role desconhecida.");
            }
            return Ok(new { cadastroCompleto });
        }
    }
}
