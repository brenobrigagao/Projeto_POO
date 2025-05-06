using Microsoft.EntityFrameworkCore;
using FFCE.Models;

namespace FFCE.Data;
public class AppDbContext : DbContext{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}
    public DbSet<Usuario> Usuarios {get;set;}
    public DbSet <Cliente> Clientes {get;set;}
    public DbSet <Produtor> Produtores {get;set;}
    public DbSet<Flor> Flores {get;set;}
    public DbSet<Produto> Produtos {get;set;}
    public DbSet<Carrinho> Carrinhos {get;set;}
    public DbSet<ItemCarrinho> ItensCarrinho {get;set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Cliente>()
        .HasOne(c => c.Usuario)
        .WithMany()
        .HasForeignKey(c => c.UsuarioId);

        modelBuilder.Entity<Produtor>()
        .HasOne(c => c.Usuario)
        .WithMany()
        .HasForeignKey(c => c.UsuarioId);

        modelBuilder.Entity<Cliente>()
            .HasOne(c => c.carrinho)
            .WithOne(carr => carr.Cliente)
            .HasForeignKey<Carrinho>(c => c.ClienteId);

        modelBuilder.Entity<Carrinho>()
            .HasMany(c => c.Itens)
            .WithOne()
            .HasForeignKey(i => i.CarrinhoId);

        modelBuilder.Entity<Produto>()
            .HasOne(p => p.flor)
            .WithMany()
            .HasForeignKey(p => p.FlorId);

        modelBuilder.Entity<Produto>()
            .HasOne(p => p.produtor)
            .WithMany(p => p.Produtos)
            .HasForeignKey(p => p.ProdutorId);

        modelBuilder.Entity<ItemCarrinho>()
            .HasOne(i => i.Produto)
            .WithMany()
            .HasForeignKey(i => i.ProdutoId);
    }
}