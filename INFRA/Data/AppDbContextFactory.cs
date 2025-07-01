using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using FFCE.Data;

namespace FFCE.Data
{
  
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            
            optionsBuilder.UseSqlite("Data Source=ffce.db");

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}