﻿using ComService.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Domain.Repositories
{
    public interface IUserStatusRepository
    {
        IQueryable<UserStatus> Users { get; }

        IQueryable<UserTrackingLocation> UserTrackingLocations { get; }
        Task<UserStatus> Get(string userId);

        void Add(UserStatus userStatus);
        void Update(UserStatus userStatus, bool isChangeLocation);

        Task SaveChangesAsync();
    }
    public class UserStatusRepository : IUserStatusRepository
    {
        private readonly ComDbContext _dbContext;

        public UserStatusRepository(ComDbContext comDbContext)
        {
            _dbContext = comDbContext;
        }
        public IQueryable<UserStatus> Users => _dbContext.Users.AsQueryable();
        public IQueryable<UserTrackingLocation> UserTrackingLocations =>
            _dbContext.Set<UserTrackingLocation>().AsQueryable();
            


        public Task<UserStatus> Get(string userId)
        {
            return _dbContext.Users.FirstOrDefaultAsync(o => o.UserId == userId);
        }
        public void Add(UserStatus userStatus)
        {
            _dbContext.Users.Add(userStatus);
            if(userStatus.LastLat.HasValue && userStatus.LastLat.HasValue)
            {
                _dbContext.Set<UserTrackingLocation>()
                   .Add(new UserTrackingLocation()
                   {
                       UserId = userStatus.UserId,
                       Date = userStatus.LastUpdateDate.Value,
                       Lat = userStatus.LastLat.Value,
                       Lon = userStatus.LastLon.Value
                   });
            }
           
        }
        public void Update(UserStatus userStatus, bool isChangeLocation)
        {
            _dbContext.Users.Update(userStatus);
            if (isChangeLocation && userStatus.LastLat.HasValue && userStatus.LastLat.HasValue)
            {
                _dbContext.Set<UserTrackingLocation>()
                   .Add(new UserTrackingLocation()
                   {
                       UserId = userStatus.UserId,
                       Date = userStatus.LastUpdateDate.Value,
                       Lat = userStatus.LastLat.Value,
                       Lon = userStatus.LastLon.Value
                   });
            }
        }

       
        public Task SaveChangesAsync()
        {
            return _dbContext.SaveChangesAsync();
        }

      
    }
}
