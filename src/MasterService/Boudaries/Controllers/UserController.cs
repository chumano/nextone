﻿using FluentValidation;
using MasterService.Domain;
using MasterService.Domain.Repositories;
using MasterService.Domain.Services;
using MasterService.DTOs.User;
using MasterService.Infrastructure;
using MasterService.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NextOne.Infrastructure.Core;
using NextOne.Shared.Common;
using NextOne.Shared.Domain;
using NextOne.Shared.Security;
using System;
using System.Linq;
using System.Threading.Tasks;
using UserDomain;

namespace MasterService.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly IUserRepository _userRepository;
        private readonly IUserService _userService;
        private readonly IIdentityService _identityService;
        private readonly IUserActivityRepository _activityRepository;
        private readonly IUserContext _userContext;
        private readonly IRoleRepository _roleRepository;
        private readonly MasterDBContext _dbContext;

        private readonly IValidator<CreateUserDTO> _createUserValidator;
        private readonly IValidator<UpdateUserDTO> _updateUserValidator;
        public UserController(ILogger<UserController> logger,
             MasterDBContext dbContext,
            IUserRepository userRepository,
            IUserService userService,
            IIdentityService identityService,
            IUserActivityRepository activityRepository,
            IUserContext userContext,
            IValidator<CreateUserDTO> createUserValidator,
            IValidator<UpdateUserDTO> updateUserValidator,
            IRoleRepository roleRepository)
        {
            _logger = logger;
            _dbContext = dbContext;
            _userRepository = userRepository;
            _userService = userService;
            _identityService = identityService;
            _activityRepository = activityRepository;
            _userContext = userContext;
            _createUserValidator = createUserValidator;
            _updateUserValidator = updateUserValidator;
            _roleRepository = roleRepository;

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
            var pageOptions = new PageOptions(getUserListDTO.Offset, getUserListDTO.PageSize);
            var query = _userRepository.Users.AsNoTracking();
            if (getUserListDTO.ExcludeMe)
            {
                query = query.Where(o => o.Id != actionUser.UserId);
            }
            if (!string.IsNullOrWhiteSpace(getUserListDTO.TextSearch))
            {
                query = query.Where(o => o.Name.Contains(getUserListDTO.TextSearch));
            }

            if(!string.IsNullOrWhiteSpace(getUserListDTO.OrderBy)  && getUserListDTO.OrderBy.ToLower() == "date")
            {
                query = query.OrderByDescending(o => o.CreatedDate);
            }
            else
            {
                query = query.OrderBy(o => o.Name);
            }
            query = query
                  .Skip(pageOptions.Offset)
                  .Take(pageOptions.PageSize);
            var items = await query.ToListAsync();
            
            //var items = await _userService.GetUsers(new PageOptions(getUserListDTO.Offset, getUserListDTO.PageSize), getUserListDTO.TextSearch);
            
            return Ok(ApiResult.Success(items));
        }


        [HttpGet("Count")]
        public async Task<IActionResult> Count([FromQuery] GetUserListDTO getUserListDTO)
        {
            var actionUser = _userContext.User;
            var query = _userRepository.Users.AsNoTracking();
            if (getUserListDTO.ExcludeMe)
            {
                query = query.Where(o => o.Id != actionUser.UserId);
            }
            if (!string.IsNullOrWhiteSpace(getUserListDTO.TextSearch))
            {
                query = query.Where(o => o.Name.Contains(getUserListDTO.TextSearch));
            }

            var count = await query.CountAsync();
            return Ok(ApiResult.Success(count));
        }

        [HttpGet("MyProfile")]
        public async Task<IActionResult> GetMyProfile()
        {
            var actionUser = _userContext.User;
            var user = await _userService.Get(actionUser.UserId);
            return Ok(ApiResult.Success(user));
        }

        [HttpPost("UpdateMyProfile")]
        public async Task<IActionResult> UpdateMyProfile(UpdateMyProfileDTO userDTO, [FromServices] IValidator<UpdateMyProfileDTO> validator)
        {
            var actionUser = _userContext.User;
            var validationResult = validator.Validate(userDTO);

            if (!validationResult.IsValid)
            {
                var combinedErrorString = string.Join(",", validationResult.Errors.Select(e => e.ErrorMessage).ToList());
                return new BadRequestObjectResult(ApiResult.Error(combinedErrorString));
            }

            var user = await _userService.Get(actionUser.UserId);
            if (user == null)
            {
                throw new DomainException("[User/UpdateMyProfile]", "User not exist");
            }

            await _userService.UpdateUser(user, userDTO.Name, user.Email, userDTO.Phone, actionUser.UserId);

            return Ok(ApiResult.Success(null));
        }

        [HttpPost("ChangeMyPassword")]
        public async Task<IActionResult> ChangeMyPassword(ChangeMyPasswordDTO userDTO)
        {
            try
            {
                var actionUser = _userContext.User;

                var user = await _userService.Get(actionUser.UserId);
                if (user == null)
                {
                    throw new DomainException("[User/UpdateMyProfile]", "User not exist");
                }

                await _identityService.ChangePassword(actionUser.UserId, userDTO.OldPassword, userDTO.NewPassword);

                return Ok(ApiResult.Success(null));
            }catch(Exception ex)
            {
                return Ok(ApiResult.Error(ex.Message));
            }
          
        }

        [HttpPost("CheckUser")]
        public async Task<IActionResult> CheckUser()
        {
            try
            {
                var actionUser = _userContext.User;
                var user = await _userService.Get(actionUser.UserId);
                if (user == null)
                {
                    await _userService.CreateUserFromIdentityUser(actionUser.UserId);
                    _logger.LogInformation($"Master User {actionUser.UserId}-{actionUser.Name} Created from IdentityUser");
                }

                return Ok(ApiResult.Success(true));
            }catch (Exception ex)
            {
                _logger.LogError(ex, "CheckUser: "+ ex.Message);
                return Ok(ApiResult.Error("Internal Error"));
            }
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
            var actionUser = _userContext.User;
            var validationResult = _createUserValidator.Validate(userDTO);
                
            if(!validationResult.IsValid)
            {
                var combinedErrorString = string.Join(",", validationResult.Errors.Select(e => e.ErrorMessage).ToList());
                return new BadRequestObjectResult(ApiResult.Error(combinedErrorString));
            }

            var userHasRegisterWithEmail = await _userService.GetUserByEmail(userDTO.Email);

            if (userHasRegisterWithEmail != null)
            {
                return Ok(ApiResult.Error("Email Already Exist"));
            }

            var user = await _userService.CreateUser(userDTO.Name, userDTO.Email, userDTO.Phone, actionUser.UserId);
            return Ok(ApiResult.Success(user));
        }

        [HttpPost("UpdateUser")]
        public async Task<IActionResult> UpdateUser(UpdateUserDTO userDTO)
        {
            var actionUser = _userContext.User;
            var validationResult = _updateUserValidator.Validate(userDTO);

            if (!validationResult.IsValid)
            {
                var combinedErrorString = string.Join(",", validationResult.Errors.Select(e => e.ErrorMessage).ToList());
                return new BadRequestObjectResult(ApiResult.Error(combinedErrorString));
            }

            var user = await _userService.Get(userDTO.UserId);
            if(user == null)
            {
                throw new DomainException("[User/UpdateUser]", "User not exist");
            }

            await _userService.UpdateUser(user, userDTO.Name, userDTO.Email, userDTO.Phone, actionUser.UserId);

            return Ok(ApiResult.Success(null));
        }

        [HttpPost("UpdateUserRoles")]
        public async Task<IActionResult> UpdateUserRoles(UpdateUserRolesDTO userDTO)
        {
            var actionUser = _userContext.User;
            var user = await _userService.Get(userDTO.UserId);
            if(user == null)
            {
                throw new DomainException("[User/UpdateUserRoles]", "User not exist");
            }

            await _userService.UpdateUserRoles(user, userDTO.RoleCodes, actionUser.UserId);

            return Ok(ApiResult.Success(null));
        }

        [HttpPost("ActiveUser")]
        public async Task<IActionResult> ActiveUser(ActiveUserDTO userDTO)
        {
            var actionUser = _userContext.User;
            var user = await _userService.Get(userDTO.UserId);
            if (user == null)
            {
                throw new DomainException("User/ActivateUser", "User not exist");
            }

            await _userService.Active(user, userDTO.IsActive, actionUser.UserId);

            return Ok(ApiResult.Success(null));
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassowrd(ResetUserPasswordDTO userDTO)
        {
            var actionUser = _userContext.User;
            var user = await _userService.Get(userDTO.UserId);
            if (user == null)
            {
                throw new DomainException("[User/ResetPassword]", "User not exist");
            }
            var passwordGenerator = new PasswordGenerator();
            var newPassword = passwordGenerator.GenerateRandomPassword();
            await _identityService.ResetPassword(user.Id, newPassword);

            return Ok(ApiResult.Success(newPassword));
        }

        [HttpPost("SelfDelete")]
        public async Task<IActionResult> SelfDelete([FromBody]UserSelfDeleteDTO dto)
        {
            var actionUser = _userContext.User;
            var user = await _userService.Get(actionUser.UserId);
            if (user == null)
            {
                throw new DomainException("[User/SelfDelete]", "User not exist");
            }

            //check password
            var isExact = await _identityService.VerifyPassword(actionUser.UserId, dto.Password);

            if (!isExact)
            {
                return Ok(ApiResult.Error("Password is invalid"));
            }

            await _userService.DeleteUser(user, isSelf: true, actionUser.UserId);

            return Ok(ApiResult.Success(null));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var actionUser = _userContext.User;
            var user = await _userService.Get(id);
            if (user == null)
            {
                throw new DomainException("[User/DeleteUser]", "User not exist");
            }

            await _userService.DeleteUser(user, isSelf: false, actionUser.UserId);

            return Ok(ApiResult.Success(null));
        }

        [HttpGet("GetActivities")]
        public async Task<IActionResult> GetActivities([FromQuery] GetUserActivitiesDTO getUserActivitiesDTO)
        {
            var query = _dbContext.UserActivities.AsNoTracking();
            if (!string.IsNullOrWhiteSpace(getUserActivitiesDTO.UserId))
            {
                query = query.Where(o => o.UserId == getUserActivitiesDTO.UserId);
            }

            if (!string.IsNullOrWhiteSpace(getUserActivitiesDTO.TextSearch))
            {
                query = query.Where(o => o.Action.Contains(getUserActivitiesDTO.TextSearch));
            }

            var users = _dbContext.Users.AsNoTracking();
            var pageOptions = new PageOptions(getUserActivitiesDTO.Offset, getUserActivitiesDTO.PageSize);
            var items =  await query
                .Join(users, ua=> ua.UserId, u => u.Id, (ua, u) => new {ua, u })
                .OrderByDescending(o => o.ua.CreatedDate)
                .Skip(pageOptions.Offset)
                .Take(pageOptions.PageSize)
                .ToListAsync();
            var mapItems = items.Select(o => new
            {
                Id = o.ua.Id,
                UserId = o.u.Id,
                UserName = o.u.Name,
                CreatedDate = o.ua.CreatedDate,
                Action = o.ua.Action,
                System = o.ua.System
            });
            return Ok(ApiResult.Success(mapItems));
        }

        [HttpGet("CountActivities")]
        public async Task<IActionResult> CountActivities([FromQuery] GetUserActivitiesDTO getUserActivitiesDTO)
        {
            var query = _dbContext.UserActivities.AsNoTracking();
            if (!string.IsNullOrWhiteSpace(getUserActivitiesDTO.UserId))
            {
                query = query.Where(o => o.UserId == getUserActivitiesDTO.UserId);
            }

            if (!string.IsNullOrWhiteSpace(getUserActivitiesDTO.TextSearch))
            {
                query = query.Where(o => o.Action.Contains(getUserActivitiesDTO.TextSearch));
            }

            var count = await query
                .CountAsync();

            return Ok(ApiResult.Success(count));
        }

        [HttpDelete("activity/{id}")]
        public async Task<IActionResult> DeleteUserActivity(string id)
        {
            var actionUser = _userContext.User;
            var activity = await _activityRepository.UserActivities.FirstOrDefaultAsync (o => o.Id == id);

            if(activity == null)
            {
                throw new DomainException("[User/DeleteUserActivity]", "UserActivity not exist");
            }
            _activityRepository.Delete(activity);
            await _activityRepository.SaveChangesAsync();
            return Ok(ApiResult.Success(null));
        }
    }
}
