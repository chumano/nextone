using MasterService.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.Domain.Repositories
{
    public interface IUserRepository
    {
        IQueryable<User> Users { get; }

        Task<User> Get(string id);
        void Add(User user);
        void Update(User user);
        void Delete(User user);

        Task SaveChangesAsync();
    }
    public class UserRepository : IUserRepository
    {
        private readonly MasterDBContext _dbContext;

        public UserRepository(MasterDBContext masterDBContext)
        {
            _dbContext = masterDBContext;
        }
        public IQueryable<User> Users => _dbContext.Users
                //.IgnoreQueryFilters()
                .Include(o => o.Roles)
                    .ThenInclude(r => r.Role)
                .AsQueryable();

        public async Task<User> Get(string id)
        {
            return await this.Users.FirstOrDefaultAsync(o => o.Id == id);
        }

        public void Add(User user)
        {
            _dbContext.Users.Add(user);
        }

        public void Update(User user)
        {
            _dbContext.Users.Update(user);
        }

        public void Delete(User user)
        {
            user.IsDeleted = true;
            _dbContext.Users.Update(user);
        }

        public Task SaveChangesAsync()
        {
            return _dbContext.SaveChangesAsync();
        }
    }
}
