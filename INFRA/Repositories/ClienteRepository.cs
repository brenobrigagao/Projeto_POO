using FFCE.Data;
using INFRA.Models;

namespace INFRA.Repositories;

public class ClienteRepository : GenericRepository<Cliente>, IClienteRepository
{
    public ClienteRepository(AppDbContext context) : base(context)
    {
    }
}