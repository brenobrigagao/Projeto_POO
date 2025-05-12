using Microsoft.EntityFrameworkCore;
using FFCE.Models;

namespace FFCE.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Produtor> Produtores { get; set; }
        public DbSet<Flor> Flores { get; set; }
        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Carrinho> Carrinhos { get; set; }
        public DbSet<ItemCarrinho> ItensCarrinho { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Cliente>()
                .HasOne(c => c.Usuario)
                .WithMany()
                .HasForeignKey(c => c.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Produtor>()
                .HasOne(p => p.Usuario)
                .WithMany()
                .HasForeignKey(p => p.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Cliente>()
                .HasOne(c => c.Carrinho)
                .WithOne(carr => carr.Cliente)
                .HasForeignKey<Carrinho>(carr => carr.ClienteId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Carrinho>()
                .HasMany(c => c.Itens)
                .WithOne(i => i.Carrinho)
                .HasForeignKey(i => i.CarrinhoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Produto>()
                .HasOne(p => p.Flor)
                .WithMany(f => f.Produtos)
                .HasForeignKey(p => p.FlorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Produto>()
                .HasOne(p => p.Produtor)
                .WithMany(prod => prod.Produtos)
                .HasForeignKey(p => p.ProdutorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ItemCarrinho>()
                .HasOne(i => i.Produto)
                .WithMany()
                .HasForeignKey(i => i.ProdutoId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Produto>(entity =>
            {
                entity.Property(p => p.ImageName)
                      .IsRequired()
                      .HasMaxLength(200);
            });
        }
    }
}
