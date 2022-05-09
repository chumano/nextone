using MapService.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace MapService.Domain.Repositories
{
    public interface IIconSymbolRepository
    {
        IQueryable<IconSymbol> Symbols { get; }

        Task<IconSymbol> Get(string name);
        void Add(IconSymbol item);
        void Delete(IconSymbol item);

        Task SaveChangesAsync();
    }

    public class IconSymbolRepository : IIconSymbolRepository
    {
        private readonly MapDBContext _dbContext;
        public IconSymbolRepository(MapDBContext dBContext)
        {
            _dbContext = dBContext;
        }

        public IQueryable<IconSymbol> Symbols => _dbContext.Symbols;

        public void Add(IconSymbol item)
        {
            _dbContext.Add(item);
        }

        public void Delete(IconSymbol item)
        {
            _dbContext.Remove(item);
        }

        public async Task<IconSymbol> Get(string name)
        {
            return await Symbols
                    .Where(o => o.Name == name)
                    .FirstOrDefaultAsync();
        }

        public Task SaveChangesAsync()
        {
            return _dbContext.SaveChangesAsync();
        }
    }
}
