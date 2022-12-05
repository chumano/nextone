using FluentValidation;
using MasterService.Domain;
using MasterService.Domain.Repositories;
using MasterService.Domain.Services;
using MasterService.DTOs.User;
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

        private readonly IValidator<CreateUserDTO> _createUserValidator;
        private readonly IValidator<UpdateUserDTO> _updateUserValidator;
        public UserController(ILogger<UserController> logger,
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

            query = query.OrderBy(o => o.Name)
                  .Skip(pageOptions.Offset)
                  .Take(pageOptions.PageSize);
            var items = await query.ToListAsync();
            
            //var items = await _userService.GetUsers(new PageOptions(getUserListDTO.Offset, getUserListDTO.PageSize), getUserListDTO.TextSearch);
            
            return Ok(ApiResult.Success(items));
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

            await _userService.UpdateUser(user, userDTO.Name, user.Email, userDTO.Phone);

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

        [HttpGet("Count")]
        public async Task<IActionResult> Count([FromQuery] GetUserListDTO getUserListDTO)
        {
            var count = await _userService.Count(getUserListDTO.TextSearch);
            return Ok(ApiResult.Success(count));
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

            var user = await _userService.CreateUser(userDTO.Name, userDTO.Email, userDTO.Phone);
            return Ok(ApiResult.Success(user));
        }

        [HttpPost("UpdateUser")]
        public async Task<IActionResult> UpdateUser(UpdateUserDTO userDTO)
        {
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

            await _userService.UpdateUser(user, userDTO.Name, userDTO.Email, userDTO.Phone);

            return Ok(ApiResult.Success(null));
        }

        [HttpPost("UpdateUserRoles")]
        public async Task<IActionResult> UpdateUserRoles(UpdateUserRolesDTO userDTO)
        {
            var user = await _userService.Get(userDTO.UserId);
            if(user == null)
            {
                throw new DomainException("[User/UpdateUserRoles]", "User not exist");
            }

            await _userService.UpdateUserRoles(user, userDTO.RoleCodes);

            return Ok(ApiResult.Success(null));
        }

        [HttpPost("ActiveUser")]
        public async Task<IActionResult> ActiveUser(ActiveUserDTO userDTO)
        {
            var user = await _userService.Get(userDTO.UserId);
            if (user == null)
            {
                throw new DomainException("User/ActivateUser", "User not exist");
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
                throw new DomainException("[User/ResetPassword]", "User not exist");
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
                throw new DomainException("[User/DeleteUser]", "User not exist");
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
