
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace UserDomain
{
    public interface IUserActivityRepository
    {
        IQueryable<UserActivity> UserActivities { get; }

        Task<UserActivity> Get(string userId, DateTime dateTime);
        void Add(UserActivity activity);
        void Update(UserActivity activity);
        void Delete(UserActivity activity);

        Task SaveChangesAsync();
    }

    public class UserActivityRepository : IUserActivityRepository
    {
        private readonly UserDBContext _dbContext;

        public UserActivityRepository(UserDBContext masterDBContext)
        {
            _dbContext = masterDBContext;
        }

        public IQueryable<UserActivity> UserActivities =>
            _dbContext.UserActivities.AsQueryable();

        public Task<UserActivity> Get(string userId, DateTime dateTime)
        {
            return UserActivities.FirstOrDefaultAsync(o => o.UserId == userId
                && o.CreatedDate == dateTime);
        }

        public void Add(UserActivity item)
        {
            _dbContext.UserActivities.Add(item);
        }
        public void Update(UserActivity item)
        {
            _dbContext.UserActivities.Update(item);
        }

        public void Delete(UserActivity item)
        {
            _dbContext.UserActivities.Remove(item);
        }

        public Task SaveChangesAsync()
        {
            return _dbContext.SaveChangesAsync();
        }

     
    }
}
