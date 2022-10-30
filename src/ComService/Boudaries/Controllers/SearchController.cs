using ComService.Domain;
using ComService.Domain.Services;
using ComService.DTOs.Conversation;
using ComService.DTOs.Search;
using ComService.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NextOne.Infrastructure.Core;
using NextOne.Shared.Common;
using NextOne.Shared.Security;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Boudaries.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {

        private readonly ILogger<SearchController> _logger;
        private readonly IUserContext _userContext;
        private readonly IUserStatusService _userStatusService;
        private readonly IConversationService _conversationService;
        private readonly ComDbContext _dbContext;
        public SearchController(
            ILogger<SearchController> logger,
            IUserContext userContext,
            IUserStatusService userService,
            IConversationService conversationService,
            ComDbContext comDbContext)
        {
            _logger = logger;
            _userContext = userContext;
            _userStatusService = userService;
            _conversationService = conversationService;
            _dbContext = comDbContext;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetList([FromQuery] SearchDTO searchDTO)
        {
            var userId = _userContext.User.UserId;
            var user = await _userStatusService.GetUser(userId);

            //conversations
            var conversationsQuery = _dbContext.Conversations.AsNoTracking()
                 .Include(o => o.Members)
                     .ThenInclude(o => o.UserMember)
                .Where(o => o.Members.Any(m => m.UserId == user.UserId));

            if (searchDTO.ConversationType != null)
            {
                conversationsQuery = conversationsQuery.Where(o => o.Type == searchDTO.ConversationType);
            }

            if (!string.IsNullOrEmpty(searchDTO.TextSearch))
            {
                conversationsQuery = conversationsQuery
                    .Where(o=>
                        o.Name.Contains(searchDTO.TextSearch)
                        || (o.Type == ConversationTypeEnum.Peer2Peer
                            && o.Members.Any(m=>
                                m.UserMember.UserName.Contains(searchDTO.TextSearch)
                                && m.UserMember.UserId != user.UserId
                            )
                        )
                    );
            }
            conversationsQuery = conversationsQuery.Take(10);

            var conversations = await conversationsQuery.ToListAsync();
            var dtos = conversations.Select(o => ConversationDTO.From(o));

            return Ok(ApiResult.Success(new {
                conversations = dtos
            }));
        }
    }
}
