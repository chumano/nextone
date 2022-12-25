using NextOne.Shared.Common;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace UserDomain
{
    public class UserActivityService
    {
        private readonly UserDBContext _dbContext;
        private readonly IdGenerator _idGenerator;
        public UserActivityService(UserDBContext dBContext, IdGenerator idGenerator)
        {
            _dbContext = dBContext;
            _idGenerator = idGenerator;
        }

        public async Task AddUserActivity(string userId, string action, string description)
        {
            var id = _idGenerator.GenerateNew();
            _dbContext.UserActivitys.Add(new UserActivity()
            {
                Id = id,
                UserId = userId,
                Action = action,
                Description = description,
            });

            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteUserActivity(string activityId, string deletedByUserId =null)
        {
            var activity = await _dbContext.UserActivitys.FindAsync(activityId);
            if (activity == null)
            {
                throw new Exception("Not found ActivityId");
            }

            activity.IsDeleted = true;
            activity.DeletedDate = DateTime.Now;
            if (!string.IsNullOrEmpty(deletedByUserId))
            {
                activity.DeletedBy = deletedByUserId;
            }
        }
    }
}
