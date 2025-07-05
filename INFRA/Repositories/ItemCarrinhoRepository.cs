using FFCE.Data;
using INFRA.Models;

namespace INFRA.Repositories;

public class ItemCarrinhoRepository : GenericRepository<ItemCarrinho>, IItemCarrinhoRepository
{
    public ItemCarrinhoRepository(AppDbContext context) : base(context)
    {
    }
}