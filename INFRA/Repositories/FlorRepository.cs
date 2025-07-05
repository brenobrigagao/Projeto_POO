using FFCE.Data;
using INFRA.Models;

namespace INFRA.Repositories;

public class FlorRepository : GenericRepository<Flor>, IFlorRepository
{
    public FlorRepository(AppDbContext context) : base(context)
    {
    }
}