using MasterService.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.Domain.Repositories
{
    public interface IRoleRepository
    {
        IQueryable<Role> Roles { get; }

        Task<Role> Get(string id);
        void Add(Role role);
        void Update(Role role);
        void Delete(Role role);

        Task SaveChangesAsync();
    }
    public class RoleRepository : IRoleRepository
    {
        private readonly MasterDBContext _dbContext;
        public RoleRepository(MasterDBContext masterDBContext)
        {
            _dbContext = masterDBContext;
        }

        public IQueryable<Role> Roles => _dbContext.Roles
                .Include(o => o.Permissions)
                    .ThenInclude(o => o.Permission)
                .AsQueryable();

        public IQueryable<Permission> Permissions => _dbContext.Permissions
              .AsQueryable();

        public async Task<Role> Get(string code)
        {
            return await this.Roles.FirstOrDefaultAsync(o => o.Code == code);
        }

        public void Add(Role role)
        {
            _dbContext.Roles.Add(role);
        }
        public void Update(Role role)
        {
            _dbContext.Roles.Update(role);
        }

        public void Delete(Role role)
        {
            _dbContext.Roles.Remove(role);
        }

        public Task SaveChangesAsync()
        {
            return _dbContext.SaveChangesAsync();
        }
    
    }
}
