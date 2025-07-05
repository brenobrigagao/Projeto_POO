using System;
using System.Threading.Tasks;
using INFRA.Repositories;

namespace FFCE.Infra.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        IClienteRepository Clientes { get; }
        IProdutoRepository Produtos { get; }
        IFlorRepository Flores { get; }
        IProdutorRepository Produtores { get; }
        ICarrinhoRepository Carrinhos { get; }
        IItemCarrinhoRepository ItensCarrinho { get; }
        Task<int> CompleteAsync();
    }
}