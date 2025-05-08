using System.Security.Claims;
using System.Security.Cryptography;
using BCrypt.Net;
using FFCE.Data;
using FFCE.Models;
using FFCE.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            .Include(p => p.flor)
            .Include(p => p.produtor)
            .Select(p => new
            {
                ProdutoId = p.Id,
                Flor = p.flor.Nome,
                Preco = p.Preco,
                Estoque = p.Estoque,
                NomeLoja = p.produtor.NomeLoja,
                ProdutorTelefone = p.produtor.Telefone
            }).ToListAsync();
        return Ok(produtos);
    }
}