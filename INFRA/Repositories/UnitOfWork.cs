using System.Threading.Tasks;
using FFCE.Data;
using INFRA.Repositories;

namespace FFCE.Infra.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public IClienteRepository Clientes { get; }
        public IProdutoRepository Produtos { get; }
        public IFlorRepository Flores { get; }
        public IProdutorRepository Produtores { get; }
        public ICarrinhoRepository Carrinhos { get; }
        public IItemCarrinhoRepository ItensCarrinho { get; }

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
            Clientes = new ClienteRepository(_context);
            Produtos = new ProdutoRepository(_context);
            Flores = new FlorRepository(_context);
            Produtores = new ProdutorRepository(_context);
            Carrinhos = new CarrinhoRepository(_context);
            ItensCarrinho = new ItemCarrinhoRepository(_context);
        }

        public Task<int> CompleteAsync() =>
            _context.SaveChangesAsync();

        public void Dispose() =>
            _context.Dispose();
    }
}