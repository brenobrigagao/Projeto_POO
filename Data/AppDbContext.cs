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
                .WithOne()
                .HasForeignKey<Produto>(p => p.FlorId)
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

            modelBuilder.Entity<Flor>(entity =>
            {
                entity.Property(f => f.ImageName)
                      .IsRequired()
                      .HasMaxLength(200);
            });

            modelBuilder.Entity<Flor>().HasData(
                new Flor
                {
                    Id = 1,
                    Nome = "Cacto em Pote",
                    Descricao = "Cacto decorativo em vaso de cerâmica",
                    ImageName = "cactoempote.jpg"
                },
                new Flor
                {
                    Id = 2,
                    Nome = "Flor Branca",
                    Descricao = "Flor de pétalas brancas, ideal para arranjos clean",
                    ImageName = "florbranca.jpg"
                },
                new Flor
                {
                    Id = 3,
                    Nome = "Rosa Vermelha",
                    Descricao = "Clássica rosa vermelha, símbolo de paixão",
                    ImageName = "rosavermelha.jpg"
                },
                new Flor
                {
                    Id = 4,
                    Nome = "Cacto Simples",
                    Descricao = "Cacto pequeno, resistente e de fácil manutenção",
                    ImageName = "cacto.jpg"
                },
                new Flor
                {
                    Id = 5,
                    Nome = "Girassol",
                    Descricao = "Girassol vibrante, traz alegria aos ambientes",
                    ImageName = "girassol.jpg"
                }
            );  

        } 

    } 
}
