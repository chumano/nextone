using MapService.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace MapService.Domain.Repositories
{
    public interface IDataSourceRepository
    {
        IQueryable<DataSource> DataSources { get; }

        Task<DataSource> Get(string id);
        void Add(DataSource dataSource);
        void Update(DataSource dataSource);
        void Delete(DataSource dataSource);

        Task SaveChangesAsync();

    }

    public class DataSourceRepository : IDataSourceRepository
    {
        private readonly MapDBContext _dbContext;
        public DataSourceRepository(MapDBContext mapDBContext)
        {
            _dbContext = mapDBContext;
        }

        public IQueryable<DataSource> DataSources => _dbContext.DataSources.AsQueryable();

        public async Task<DataSource> Get(string id)
        {
            return await _dbContext.DataSources.FindAsync(id);
        }

        public void Add(DataSource dataSource)
        {
            _dbContext.Add(dataSource);
        }

        public void Update(DataSource dataSource)
        {
            _dbContext.Update(dataSource);
        }

        public void Delete(DataSource dataSource)
        {
            _dbContext.Remove(dataSource);
        }

        public Task SaveChangesAsync()
        {
           return _dbContext.SaveChangesAsync();
        }

     
    }
}
