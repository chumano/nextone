using MapService.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace MapService.Domain.Repositories
{
    public interface IMapRepository
    {
        IQueryable<MapInfo> Maps { get; }

        Task<MapInfo> Get(string id);
        void Add(MapInfo dataSource);
        void Update(MapInfo dataSource);
        void Delete(MapInfo dataSource);

        Task SaveChangesAsync();

    }

    public class MapRepository : IMapRepository
    {
        private readonly MapDBContext _dbContext;
        public MapRepository(MapDBContext mapDBContext)
        {
            _dbContext = mapDBContext;
        }

        public IQueryable<MapInfo> Maps => _dbContext.Maps.AsQueryable()
                .Include(o=> o.Layers)
                    .ThenInclude(l => l.DataSource);

        public async Task<MapInfo> Get(string id)
        {
            return await this.Maps.FirstOrDefaultAsync(o => o.Id == id);
        }

        public void Add(MapInfo dataSource)
        {
            _dbContext.Add(dataSource);
        }

        public void Update(MapInfo dataSource)
        {
            _dbContext.Update(dataSource);
        }

        public void Delete(MapInfo dataSource)
        {
            _dbContext.Remove(dataSource);
        }

        public Task SaveChangesAsync()
        {
            return _dbContext.SaveChangesAsync();
        }


    }
}
