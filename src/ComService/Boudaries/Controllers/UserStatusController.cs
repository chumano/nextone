using ComService.Domain.Services;
using ComService.DTOs.UserStatus;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NextOne.Infrastructure.Core;
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
        private readonly IUserStatusService _userService;
        public UserStatusController(IUserStatusService userService)
        {
            _userService = userService;
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCurrentUserStatus(string id)
        {
            var user = await _userService.GetUser(id);
            return Ok(ApiResult.Success(user));
        }

        [HttpGet("GetHistoryUserLocation")]
        public IActionResult GetHistoryUserLocation(GetHistoryUserLocationDTO getHistoryUserLocationDTO)
        {
            throw new NotImplementedException();
        }

        [HttpPost("UpdateUserLocation")]
        public async Task<IActionResult> UpdateUserLocationAsync(UpdateUserLocationDTO updateUserLocationDTO)
        {
            await _userService.AddOrUpdateUserStatus(updateUserLocationDTO.UserId,
                updateUserLocationDTO.Lat,
                updateUserLocationDTO.Lon);
            return Ok(ApiResult.Success(null));
        }
    }
}
