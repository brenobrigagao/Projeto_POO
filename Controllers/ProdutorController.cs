using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using FFCE.Data;
using FFCE.Models;
using System.Security.Claims;
using FFCE.DTOs;

namespace FFCE.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Produtor")]
public class ProdutorController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProdutorController(AppDbContext context)
    {
        _context = context;
    }
    [HttpPost("cadastrar-produto")]
    public async Task<IActionResult> CadastrarProduto(ProdutoCadastroDTO dto)
    {
        var usuarioId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var produtor = await _context.Produtores.FirstOrDefaultAsync(p => p.UsuarioId == usuarioId);
        if (produtor == null) return BadRequest("Produtor não encontrado");

        var florExiste = await _context.Flores.AnyAsync(f => f.Id == dto.FlorId);
        if (!florExiste) return BadRequest("Flor inválida.");

        var produto = new Produto
        {
            FlorId = dto.FlorId,
            ProdutorId = produtor.Id,
            Preco = dto.Preco,
            Estoque = dto.Estoque
        };

        _context.Produtos.Add(produto);
        await _context.SaveChangesAsync();

        return Ok("Produto cadstrado com sucesso.");
    }
}