using FFCE.Data;
using INFRA.Models;

namespace INFRA.Repositories;

public class ProdutorRepository : GenericRepository<Produtor>, IProdutorRepository
{
    public ProdutorRepository(AppDbContext context) : base(context)
    {
    }
}