using BCrypt.Net;
using FFCE.Data;
using FFCE.DTOs;
using FFCE.Models;
using FFCE.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FFCE.Controllers;
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly TokenService _tokenService;

    public AuthController(AppDbContext context, TokenService tokenService){
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("registrar")]
    public async Task<IActionResult> Registro(RegistroDTO dto){
        var usuarioExistente = await _context.Usuarios.AnyAsync(u => u.Email == dto.Email);
        if(usuarioExistente) return BadRequest("Email já cadastrado.");
        var usuario = new Usuario
        {
            Email = dto.Email,
            SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha),
            Role = dto.Role
        };
        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return Ok(new {message = "O usuário foi registrado com sucesso!"});
    }
}