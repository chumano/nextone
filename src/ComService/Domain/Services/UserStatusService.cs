using ComService.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Domain.Services
{
    public interface IUserStatusService
    {
        Task<UserStatus> GetUser(string userId);

        Task<IList<UserStatus>> GetUsersByIds(IList<string> userIds);

        Task AddOrUpdateUserStatus(string userId, double? lat, double? lon);
    }
    public class UserStatusService : IUserStatusService
    {
        private readonly IUserStatusRepository _userStatusRepository;
        public UserStatusService(IUserStatusRepository userStatusRepository)
        {
            _userStatusRepository = userStatusRepository;
        }
        public async Task<UserStatus> GetUser(string userId)
        {
            return new UserStatus()
            {
                UserId = userId
            };
        }

        public async Task<IList<UserStatus>> GetUsersByIds(IList<string> userIds)
        {
            return userIds.Select(userId =>
            {
                return new UserStatus()
                {
                    UserId = userId
                };
            }).ToList();
        }

        public async Task AddOrUpdateUserStatus(string userId, double? lat, double? lon)
        {
            var userStatus = await _userStatusRepository.Get(userId);
            if(userStatus == null)
            {
                _userStatusRepository.Add(new UserStatus()
                {
                    UserId = userId,
                    LastLat = lat,
                    LastLon = lon,
                    LastUpdateDate = DateTime.Now,
                    Status = StatusEnum.Online
                }); 
            }
            else
            {
                userStatus.LastLat = lat;
                userStatus.LastLon = lon;
                userStatus.LastUpdateDate = DateTime.Now;
                userStatus.Status = StatusEnum.Online;
                _userStatusRepository.Update(userStatus);
            }
           
            await _userStatusRepository.SaveChangesAsync();
        }
    }
}
