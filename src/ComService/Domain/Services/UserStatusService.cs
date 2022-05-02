﻿using ComService.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
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
        private readonly IMasterService _masterService;

        public UserStatusService(IUserStatusRepository userStatusRepository,
            IMasterService masterService)
        {
            _userStatusRepository = userStatusRepository;
            _masterService = masterService;
        }
        public async Task<UserStatus> GetUser(string userId)
        {
            var userStatus = await _userStatusRepository.Get(userId);
            if (userStatus != null)
            {
                return userStatus;
            }
            
            var user = await _masterService.GetUserAsync(userId);

            return new UserStatus()
            {
                UserId = userId,
                UserName = user.UserName,
                UserAvatarUrl = "",
                LastLat = null,
                LastLon = null,
                LastUpdateDate = DateTime.Now,
                Status = StatusEnum.Offline
            };
        }

        public async Task<IList<UserStatus>> GetUsersByIds(IList<string> userIds)
        {
            var userStatuses = await _userStatusRepository.Users
                .Where(o => userIds.Contains(o.UserId))
                .ToListAsync();

            var notFoundUserIds = userIds.Where(userId => !userStatuses.Any(s => s.UserId == userId))
                .ToList();

            if (notFoundUserIds.Any())
            {
                var users = await _masterService.GetUsersAsync(notFoundUserIds);
                var notFoundUserStatuses = users.Select(user => new UserStatus()
                {
                    UserId = user.UserId,
                    UserName = user.UserName,
                    UserAvatarUrl = "",
                    LastLat = null,
                    LastLon = null,
                    LastUpdateDate = DateTime.Now,
                    Status = StatusEnum.Offline
                });

                userStatuses.AddRange(notFoundUserStatuses);
            }

            return userStatuses;
        }

        public async Task AddOrUpdateUserStatus(string userId, double? lat, double? lon)
        {
            var userStatus = await _userStatusRepository.Get(userId);
            if(userStatus == null)
            {
                var user = await _masterService.GetUserAsync(userId);
                _userStatusRepository.Add(new UserStatus()
                {
                    UserId = userId,
                    UserName = user.UserName,
                    UserAvatarUrl = "",
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
