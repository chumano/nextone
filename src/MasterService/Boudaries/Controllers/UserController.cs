using MasterService.Domain.Repositories;
using MasterService.Domain.Services;
using MasterService.DTOs.User;
using MasterService.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NextOne.Infrastructure.Core;
using NextOne.Shared.Common;
using NextOne.Shared.Domain;
using NextOne.Shared.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly IUserService _userService;
        private readonly IIdentityService _identityService;
        private readonly IUserActivityRepository _activityRepository;
        private readonly IUserContext _userContext;
        public UserController(ILogger<UserController> logger,
            IUserService userService,
            IIdentityService identityService,
            IUserActivityRepository activityRepository,
            IUserContext userContext)
        {
            _logger = logger;
            _userService = userService;
            _identityService = identityService;
            _activityRepository = activityRepository;
            _userContext = userContext;
        }

        [HttpGet]
        public IActionResult Get()
        {
            this.Response.Headers.Add("CHUNO", "chumano");
            var upStreamHeader = this.Request.Headers["header-up"];
            return Ok($"[Master service][user] - header: {upStreamHeader} ");
        }

        [HttpGet("GetList")]
        public async Task<IActionResult> GetList([FromQuery] GetUserListDTO getUserListDTO)
        {
            var actionUser =_userContext.User;
            var items = await _userService.GetUsers(new PageOptions(getUserListDTO.Offset, getUserListDTO.PageSize));
            return Ok(ApiResult.Success(items));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var user = await _userService.Get(id);
            return Ok(ApiResult.Success(user));
        }

        [HttpPost("CreateUser")]
        public async Task<IActionResult> CreateUser(CreateUserDTO userDTO)
        {
            var user = await _userService.CreateUser(userDTO.Name, userDTO.Email, userDTO.Phone);
            return Ok(ApiResult.Success(user));
        }

        [HttpPost("UpdateUser")]
        public async Task<IActionResult> UpdateUser(UpdateUserDTO userDTO)
        {
            var user = await _userService.Get(userDTO.UserId);
            if(user == null)
            {
                throw new DomainException("", "");
            }

            await _userService.UpdateUser(user, userDTO.Name, userDTO.Email, userDTO.Phone, userDTO.RoleCodes);

            return Ok(ApiResult.Success(null));
        }

        [HttpPost("ActiveUser")]
        public async Task<IActionResult> ActiveUser(ActiveUserDTO userDTO)
        {
            var user = await _userService.Get(userDTO.UserId);
            if (user == null)
            {
                throw new DomainException("", "");
            }

            await _userService.Active(user, userDTO.IsActive);

            return Ok(ApiResult.Success(null));
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassowrd(ResetUserPasswordDTO userDTO)
        {
            var user = await _userService.Get(userDTO.UserId);
            if (user == null)
            {
                throw new DomainException("", "");
            }
            var passwordGenerator = new PasswordGenerator();
            var newPassword = passwordGenerator.GenerateRandomPassword();
            await _identityService.ResetPassword(user.Id, newPassword);

            return Ok(ApiResult.Success(newPassword));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var user = await _userService.Get(id);
            if (user == null)
            {
                throw new DomainException("", "");
            }

            await _userService.DeleteUser(user);

            return Ok(ApiResult.Success(null));
        }

        [HttpGet("GetActivities")]
        public async Task<IActionResult> GetActivities([FromBody] GetUserActivitiesDTO getUserActivitiesDTO)
        {
            var query = _activityRepository.UserActivities;
            if (!string.IsNullOrWhiteSpace(getUserActivitiesDTO.UserId))
            {
                query = query.Where(o => o.UserId == getUserActivitiesDTO.UserId);
            }

            var pageOptions = new PageOptions(getUserActivitiesDTO.Offset, getUserActivitiesDTO.PageSize);
            var items =  await query.OrderByDescending(o => o.CreatedDate)
                .Skip(pageOptions.Offset)
                .Take(pageOptions.PageSize)
                .ToListAsync();
               
            return Ok(ApiResult.Success(items));
        }
    }
}
