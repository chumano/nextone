using ComService.Domain;
using ComService.Domain.Services;
using ComService.DTOs.Conversation;
using Microsoft.AspNetCore.Mvc;
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
    [ApiController]
    [Route("[controller]")]
    public class ConversationController : ControllerBase
    {
        private readonly ILogger<ConversationController> _logger;
        private readonly IUserContext _userContext;
        private readonly IUserStatusService _userService;
        private readonly IdGenerator _idGenerator;
        private readonly IConversationService _conversationService;
        public ConversationController(
            ILogger<ConversationController> logger,
            IUserContext userContext,
            IdGenerator idGenerator,
            IUserStatusService userService,
            IConversationService conversationService)
        {
            _logger = logger;
            _userContext = userContext;
            _idGenerator = idGenerator;
            _userService = userService;
            _conversationService = conversationService;
        }

        [HttpGet("GetList")]
        public async Task<IActionResult> GetList([FromQuery] GetListConversationDTO getListConversationDTO)
        {
            var userId = _userContext.User.UserId;
            var user = await _userService.GetUser(userId);
            var conversations = await _conversationService.GetConversationsByUser(user,
                new PageOptions()
                {
                    Offset = getListConversationDTO.Offset,
                    PageSize = getListConversationDTO.PageSize > 0 ? getListConversationDTO.PageSize : PageOptions.DefaultPageSize
                });
            return Ok(ApiResult.Success(conversations));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var conversation = await _conversationService.Get(id);

            return Ok(ApiResult.Success(conversation));
        }


        [HttpPost("CreateConversation")]
        public async Task<IActionResult> CreateConversation(CreateConverationDTO createConverationDTO)
        {
            var userId = _userContext.User.UserId;
            var user = await _userService.GetUser(userId);
            var conversationId = await _conversationService.Create(user,
                createConverationDTO.Name,
                createConverationDTO.Type,
                createConverationDTO.MemberIds);

            return Ok(ApiResult.Success(conversationId));
        }

        //member 
        [HttpPost("AddMembers")]
        public async Task<IActionResult> AddMembers(AddMembersDTO addMembersDTO)
        {
            var userId = _userContext.User.UserId;
            var user = await _userService.GetUser(userId);
            var conversation = await _conversationService.Get(addMembersDTO.ConversationId);

            //TODO: check user have permission to addMembers 
            await _conversationService.AddMembers(conversation, addMembersDTO.MemberIds);

            return Ok(ApiResult.Success(null));
        }

        [HttpPost("RemoveMember")]
        public async Task<IActionResult> RemoveMember(RemoveMemberDTO removeMemberDTO)
        {
            var userId = _userContext.User.UserId;
            var user = await _userService.GetUser(userId);
            var conversation = await _conversationService.Get(removeMemberDTO.ConversationId);

            //TODO: check user have permission to remove member 

            var removedUser = await _userService.GetUser(removeMemberDTO.UserMemberId);
            await _conversationService.RemoveMember(conversation, removedUser);

            return Ok(ApiResult.Success(null));
        }

        [HttpPost("UpdateMemberRole")]
        public async  Task<IActionResult> UpdateMemberRole(UpdateMemberRoleDTO updateMemberRoleDTO)
        {
            var userId = _userContext.User.UserId;
            var user = await _userService.GetUser(userId);
            var conversation = await _conversationService.Get(updateMemberRoleDTO.ConversationId);

            //TODO: check user have permission to UpdateMemberRole

            var updatedUser = await _userService.GetUser(updateMemberRoleDTO.UserMemberId);
            await _conversationService.UpdateMemberRole(conversation, updatedUser, updateMemberRoleDTO.Role);
            return Ok(ApiResult.Success(null));
        }

        //message
        [HttpGet("GetMessagesHistory")]
        public async Task<IActionResult> GetMessagesHistory([FromQuery]GetMessagesHistoryDTO getMessageHistoryDTO)
        {
            var userId = _userContext.User.UserId;
            var user = await _userService.GetUser(userId);
            var conversation = await _conversationService.Get(getMessageHistoryDTO.ConversationId);

            //TODO: check user have permission to GetMessageHistory
            var messages = await _conversationService.GetMessagesHistory(conversation,
                getMessageHistoryDTO.BeforeDate,
                new PageOptions()
                {
                    Offset = getMessageHistoryDTO.Offset,
                    PageSize = getMessageHistoryDTO.PageSize > 0 ? getMessageHistoryDTO.PageSize : PageOptions.DefaultPageSize
                });

            return Ok(ApiResult.Success(messages));
        }

        [HttpPost("CreateFirstMessage")]
        public Task<IActionResult> CreateFirstMessage(CreateFirstMessageDTO createMessageDTO)
        {
            //TODO: CreateFirstMessage
            throw new NotImplementedException();
        }

        [HttpPost("SendMessage")]
        public  async Task<IActionResult> SendMessage(SendMessageDTO sendMessageDTO)
        {
            if(string.IsNullOrWhiteSpace(sendMessageDTO.Content)
                && (sendMessageDTO.Files == null || sendMessageDTO.Files.Count == 0))
            {
                throw new Exception("SendMessage parameters is invalid");
            }
            var userId = _userContext.User.UserId;
            var user = await _userService.GetUser(userId);
            var conversation = await _conversationService.Get(sendMessageDTO.ConversationId);

            //TODO: check user have permission to SendMessage into the Conversation

            var messageType = MessageTypeEnum.Text;
            var messageId = _idGenerator.GenerateNew();
            var messageFiles = new List<MessageFile>();
            if (sendMessageDTO.Files != null)
            {
                messageFiles = sendMessageDTO.Files.Select(o => new MessageFile()
                {
                    FileId = o.FileId,
                    FileType = o.FileType,
                    FileUrl = o.FileUrl
                }).ToList();
            }

            Message message = new Message(messageId, messageType,user.UserId, 
                sendMessageDTO.Content,
                messageFiles);
            await _conversationService.AddMessage(conversation, message);

            return Ok(ApiResult.Success(null));
        }


    }
}
