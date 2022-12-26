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
        private readonly IUserActivityRepository _userActivityRepository;
        public UserActivityService(UserDBContext dBContext,
            IUserActivityRepository repository,
            IdGenerator idGenerator)
        {
            _dbContext = dBContext;
            _idGenerator = idGenerator;
            _userActivityRepository = repository;
        }

        public async Task AddUserActivity(string userId, string action, string description)
        {
            var id = _idGenerator.GenerateNew();
            _userActivityRepository.Add(new UserActivity()
            {
                Id = id,
                UserId = userId,
                Action = action,
                Description = description,
            });

            await _userActivityRepository.SaveChangesAsync();
        }

        public async Task DeleteUserActivity(string activityId, string deletedByUserId =null)
        {
            var activity = await _dbContext.UserActivities.FindAsync(activityId);
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

            await _userActivityRepository.SaveChangesAsync();
        }
    }
}
