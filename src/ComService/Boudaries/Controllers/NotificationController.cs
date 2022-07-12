using ComService.Domain.DomainEvents;
using ComService.Domain.Services;
using ComService.DTOs.Notification;
using ComService.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NextOne.Infrastructure.Core;
using NextOne.Shared.Bus;
using NextOne.Shared.Security;
using System;
using System.Threading.Tasks;

namespace ComService.Boudaries.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly ICloudService _cloudService;
        private readonly ILogger<NotificationController> _logger;
        private readonly IUserContext _userContext;
        private readonly IUserStatusService _userStatusService;
        private readonly ComDbContext _comDbContext;
        private readonly IBus _bus;
        public NotificationController(ICloudService cloudService,
            ILogger<NotificationController> logger,
            IUserStatusService userService,
            IUserContext userContext,
            ComDbContext comDbContext,
            IBus bus)
        {
            _cloudService = cloudService;
            _logger = logger;
            _userStatusService = userService;
            _userContext = userContext;
            _comDbContext = comDbContext;
            _bus = bus;
        }

        [HttpPost("RegisterToken")]
        public async Task<IActionResult> RegisterToken([FromBody] RegisterTokenDTO registerTokenDTO)
        {
            try
            {
                var userId = _userContext.User.UserId;
                var user = await _userStatusService.GetUser(userId);
                if (user == null)
                {
                    throw new Exception("User is not found");
                }

                if (!string.IsNullOrWhiteSpace(registerTokenDTO.OldToken))
                {
                    await RemoveToken(user.UserId, registerTokenDTO.OldToken);
                }

                var userToken = await _comDbContext.UserDeviceTokens.FindAsync(user.UserId, registerTokenDTO.Token);
                if (userToken == null)
                {
                    _comDbContext.UserDeviceTokens.Add(new Domain.UserDeviceToken()
                    {
                        UserId = user.UserId,
                        Token = registerTokenDTO.Token,
                        OS = registerTokenDTO.Os,
                        Date = DateTime.Now
                    });
                }
                else
                {
                    userToken.OS = registerTokenDTO.Os;
                    userToken.Date = DateTime.Now;
                    _comDbContext.UserDeviceTokens.Update(userToken);
                }

                await _comDbContext.SaveChangesAsync();
                return Ok(ApiResult.Success(null));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[NotificationController][RegisterToken]: " + ex.Message);
                return Ok(ApiResult.Error(ex.Message));
            }
        }

        [HttpPost("RemoveToken")]
        public async Task<IActionResult> RemoveToken([FromBody] RemoveTokenDTO removeTokenDTO)
        {
            try
            {
                var userId = _userContext.User.UserId;
                var user = await _userStatusService.GetUser(userId);
                if (user == null)
                {
                    throw new Exception("User is not found");
                }

                bool isRemove = await RemoveToken(user.UserId, removeTokenDTO.Token);
                if (isRemove)
                {
                    await _comDbContext.SaveChangesAsync();
                }

                return Ok(ApiResult.Success(null));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[NotificationController][RemoveToken]: " + ex.Message);
                return Ok(ApiResult.Error(ex.Message));
            }
        }

        private async Task<bool> RemoveToken(string userId, string token)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                return false;
            }

            var userToken = await _comDbContext.UserDeviceTokens.FindAsync(userId, token);
            if (userToken != null)
            {
                _comDbContext.UserDeviceTokens.Remove(userToken);
                return true;
            }

            return false;
        }

        [HttpPost("Call")]
        public async Task<IActionResult> Call([FromBody] CallRequestDTO callRequest)
        {
            var userId = _userContext.User.UserId;
            await _bus.Publish(new CallRequetEvent()
            {
                UserSenderId = userId,
                UserReceiverId = callRequest.ReceiverId,
                CallType = callRequest.CallType
            });
            return Ok(ApiResult.Success(null));
        }
    }
}
