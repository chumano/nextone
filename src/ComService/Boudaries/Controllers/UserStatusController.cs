using ComService.Domain.Repositories;
using ComService.Domain.Services;
using ComService.DTOs.UserStatus;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NextOne.Infrastructure.Core;
using NextOne.Shared.Common;
using NextOne.Shared.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Boudaries.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserStatusController : ControllerBase
    {
        private readonly ILogger<UserStatusController> _logger;
        private readonly IUserStatusService _userService;
        private readonly IUserStatusRepository _userStatusRepository;
        private readonly IUserContext _userContext;
        public UserStatusController(
            ILogger<UserStatusController> logger,
            IUserStatusService userService,
            IUserStatusRepository userStatusRepository,
            IUserContext userContext)
        {
            _logger = logger;
            _userService = userService;
            _userStatusRepository = userStatusRepository;
            _userContext = userContext;
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCurrentUserStatus(string id)
        {
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
            var user = _userContext.User;
            await _userService.AddOrUpdateUserStatus(updateUserLocationDTO.UserId,
                updateUserLocationDTO.Lat,
                updateUserLocationDTO.Lon);
            return Ok(ApiResult.Success(null));
        }
    }
}
