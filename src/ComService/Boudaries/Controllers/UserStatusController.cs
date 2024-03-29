﻿using ComService.Domain.Repositories;
using ComService.Domain.Services;
using ComService.DTOs.UserStatus;
using ComService.Helpers;
using ComService.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using NextOne.Infrastructure.Core;
using NextOne.Shared.Common;
using NextOne.Shared.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Boudaries.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class UserStatusController : ControllerBase
    {
        private readonly ILogger<UserStatusController> _logger;
        private readonly IUserStatusService _userService;
        private readonly IUserStatusRepository _userStatusRepository;
        private readonly IUserContext _userContext;
        private readonly IConfiguration _configuration;
        private readonly ComDbContext _comDbContext;
        public UserStatusController(
            ILogger<UserStatusController> logger,
            IUserStatusService userService,
            IUserStatusRepository userStatusRepository,
            IConfiguration configuration,
            IUserContext userContext,
            ComDbContext comDbContext)
        {
            _logger = logger;
            _userService = userService;
            _userStatusRepository = userStatusRepository;
            _userContext = userContext;
            _configuration = configuration;
            _comDbContext= comDbContext;
        }

        //Get online user with location
        [HttpGet("GetOnlineUsersForMap")]
        public async Task<IActionResult> GetOnlineUsersForMap([FromQuery] GetOnlineUsersDTO filterDTO)
        {
            var pageOptions = new PageOptions(filterDTO.Offset, filterDTO.PageSize);
            var actionsUser = _userContext.User;

            var nearDateTime = DateTime.Now.AddMinutes(-Constants.NOT_ACTIVE_MINUTES);
            var relativeUserQuery =
                    _comDbContext.ConversationMembers.AsNoTracking()
                        .Where(o => o.UserId != actionsUser.UserId
                            && (o.Role == Domain.MemberRoleEnum.MANAGER
                                || o.Role == Domain.MemberRoleEnum.MEMBER)
                        )
                    .Join(
                        _comDbContext.ConversationMembers.AsNoTracking()
                            .Where(o => o.UserId == actionsUser.UserId)
                            .Select(o => o.ConversationId)
                        ,
                        cMember => cMember.ConversationId,
                        cId => cId,
                        (cMember, cId)=> cMember.UserId
                    ).Distinct();
            var query = _userStatusRepository.Users.AsNoTracking()
                    .Where(o => o.LastUpdateDate !=null && o.LastUpdateDate > nearDateTime)
                    .Join(relativeUserQuery,
                            o => o.UserId,
                            rUserID => rUserID,
                            (user, cM) => user
                        );

            var users = await query
                    .OrderByDescending(o=>o.LastUpdateDate)
                    .Skip(pageOptions.Offset).Take(pageOptions.PageSize)
                    .ToListAsync();
            return Ok(ApiResult.Success(users));
        }

        [HttpGet("GetList")]
        public async Task<IActionResult> GetList([FromQuery] GetListUserStatusDTO getListUserStatusDTO)
        {
            var pageOptions = new PageOptions(getListUserStatusDTO.Offset, getListUserStatusDTO.PageSize);
            var actionsUser = _userContext.User;
            var query = _userStatusRepository.Users.AsNoTracking();
            if (getListUserStatusDTO.ExcludeMe)
            {
                query = query.Where(o => o.UserId != actionsUser.UserId);
            }
            var users = await query.Skip(pageOptions.Offset).Take(pageOptions.PageSize)
                    .ToListAsync();
            return Ok(ApiResult.Success(users));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCurrentUserStatus(string id)
        {
            var actionsUser = _userContext.User;
            var user = await _userService.GetUser(id);
            return Ok(ApiResult.Success(user));
        }

        [HttpGet("GetHistoryUserLocation")]
        public async Task<IActionResult> GetHistoryUserLocation(GetHistoryUserLocationDTO getHistoryUserLocationDTO)
        {
            var pagingOptions = new PageOptions(getHistoryUserLocationDTO.Offset, getHistoryUserLocationDTO.PageSize);
            var items = await _userStatusRepository.UserTrackingLocations
                .Where(o => o.UserId == getHistoryUserLocationDTO.UserId)
                .Where(o => o.Date >= getHistoryUserLocationDTO.FromDate)
                .Where(o => o.Date <= getHistoryUserLocationDTO.ToDate)
                .OrderByDescending(o => o.Date)
                .Skip(pagingOptions.Offset)
                .Take(pagingOptions.PageSize)
                .ToListAsync();

            return Ok(ApiResult.Success(items));
        }

        [HttpPost("UpdateUserLocation")]
        public async Task<IActionResult> UpdateUserLocationAsync(UpdateUserLocationDTO updateUserLocationDTO)
        {
            var currentUserId = _userContext.User.UserId;
            if(currentUserId == HttpUserContext.AnonymousUserId)
            {
                return Ok(ApiResult.Error(currentUserId));
            }
            var userId = updateUserLocationDTO.UserId;
            if (string.IsNullOrWhiteSpace(updateUserLocationDTO.UserId))
            {
                userId = currentUserId;
            }
            await _userService.AddOrUpdateUserStatus(userId,
                updateUserLocationDTO.Lat,
                updateUserLocationDTO.Lon);
            return Ok(ApiResult.Success(null));
        }

        [HttpGet("GetNearUsers")]
        public async Task<IActionResult> GetNearUser([FromQuery] GetNearUsersDTO dto)
        {
            var maxDistance = _configuration.GetValue<double>("Application:MaxFindUserDistanceInMeters", 1000);
            var limitDistance = Math.Max(maxDistance, dto.DistanceInMeter);
            var pageOptions = new PageOptions(dto.Offset, dto.PageSize);
            var actionsUser = _userContext.User;
            var fromDate = DateTime.Now.Date;
            var query = _userStatusRepository.Users.AsNoTracking()
                            .Where(o => o.LastUpdateDate != null &&  o.LastUpdateDate > fromDate)
                            .Where(o => o.LastLat != null && o.LastLon != null)
                            .Where(o => o.UserId != actionsUser.UserId);
            ;
            
            var users = await query//.Skip(pageOptions.Offset).Take(pageOptions.PageSize)
                    .ToListAsync();

            _logger.LogInformation($"GetNearUsers: {dto.Lat}- {dto.Lon} ({dto.DistanceInMeter}): " + JsonConvert.SerializeObject(users.Select(o => o.UserName)));
            var fromCoord = new Coordinates(dto.Lat, dto.Lon);
            
            var nearUsers = new List<UserNearDTO>();
            
            foreach (var user in users)
            {
                if(user.LastLat!=null && user.LastLon != null)
                {
                    var distance = fromCoord.DistanceTo(
                           new Coordinates(user.LastLat??0, user.LastLon??0),
                           UnitOfLength.Meters
                       );
                    _logger.LogInformation($"Distance from user {user.UserName} ({user.LastLat},{user.LastLon}):{distance}");
                    if (distance < limitDistance)
                    {
                        nearUsers.Add(new UserNearDTO()
                        {
                            User = user,
                            DistanceInMeter = distance
                        });
                    }
                }
               
            }

            return Ok(ApiResult.Success(nearUsers.OrderBy(o=>o.DistanceInMeter)));
        }

    }
}
