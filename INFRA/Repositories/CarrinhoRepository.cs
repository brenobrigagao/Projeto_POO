using FFCE.Data;
using INFRA.Models;

namespace INFRA.Repositories;

public class CarrinhoRepository : GenericRepository<Carrinho>, ICarrinhoRepository
{
    public CarrinhoRepository(AppDbContext context) : base(context)
    {
    }
}