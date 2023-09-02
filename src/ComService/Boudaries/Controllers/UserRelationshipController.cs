using ComService.Domain;
using ComService.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NextOne.Infrastructure.Core;
using NextOne.Shared.Security;
using System.Threading.Tasks;

namespace ComService.Boudaries.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRelationshipController : ControllerBase
    {
        private readonly ComDbContext _dbContext;
        private readonly IUserContext _userContext;
        public UserRelationshipController(ComDbContext comDbContext,
            IUserContext userContext)
        {
            _dbContext = comDbContext;
            _userContext = userContext;
        }

        [HttpPost("[action]")]
        //AddFriend
        public async Task<IActionResult> AddFriend([FromBody] AddFriendDto friendDto)
        {
            //check exist friend
            var userId = _userContext.User.UserId;
            var relation = new UserRelationship(userId, friendDto.OtherUserId);
            relation.SetFriend(true);

            _dbContext.UserRelationships.Add(relation);
            await _dbContext.SaveChangesAsync();
            return Ok(ApiResult.Success(null));
        }

        //RemoveFrend
        public async Task<IActionResult> RemoveFrend([FromBody] AddFriendDto friendDto)
        {
            //check exist friend
            var userId = _userContext.User.UserId;

            var existRelationShip = await _dbContext.UserRelationships.FindAsync(new string[] { userId,  });
            var relation = new UserRelationship(userId, friendDto.OtherUserId);
            relation.SetFriend(true);

            _dbContext.UserRelationships.Add(relation);
            await _dbContext.SaveChangesAsync();

            return Ok(ApiResult.Success(null));
        }

        //GetFriends
        public async Task<IActionResult> GetFriends()
        {

            _dbContext.
            return Ok(ApiResult.Success(null));
        }

        //BLockUser
        public async Task<IActionResult> BlockUser()
        {
            return Ok(ApiResult.Success(null));
        }

        //UnlockUser
        public async Task<IActionResult> UnlockUser()
        {
            return Ok(ApiResult.Success(null));
        }

        //GetBlockedUsers
        public async Task<IActionResult> GetBlockUser()
        {
            return Ok(ApiResult.Success(null));
        }

        public class AddFriendDto
        {
            public string OtherUserId { get; set; }
        }
    }
}
