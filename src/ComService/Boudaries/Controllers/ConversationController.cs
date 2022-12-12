using ComService.Domain;
using ComService.Domain.Services;
using ComService.DTOs.Channel;
using ComService.DTOs.Conversation;
using ComService.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using NextOne.Infrastructure.Core;
using NextOne.Shared.Common;
using NextOne.Shared.Domain;
using NextOne.Shared.Security;
using SharedDomain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Boudaries.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ConversationController : ControllerBase
    {
        private readonly ILogger<ConversationController> _logger;
        private readonly IUserContext _userContext;
        private readonly IUserStatusService _userStatusService;
        private readonly IdGenerator _idGenerator;
        private readonly IChannelService _channelService;
        private readonly IConversationService _conversationService;
        protected readonly ComDbContext _dbContext;
        public ConversationController(
            ILogger<ConversationController> logger,
            IUserContext userContext,
            ComDbContext comDbContext,
            IdGenerator idGenerator,
            IUserStatusService userService,
            IConversationService conversationService,
            IChannelService channelService)
        {
            _logger = logger;
            _dbContext = comDbContext;
            _userContext = userContext;
            _idGenerator = idGenerator;
            _userStatusService = userService;
            _conversationService = conversationService;
            _channelService = channelService;
        }

        [HttpGet("GetList")]
        public async Task<IActionResult> GetList([FromQuery] GetListConversationDTO getListConversationDTO)
        {
            var pageOptions = new PageOptions(getListConversationDTO.Offset, getListConversationDTO.PageSize);
            var userId = _userContext.User.UserId;
            var user = await _userStatusService.GetUser(userId);
            var conversations = await _conversationService.GetConversationsByUser(user,
                pageOptions, getListConversationDTO.IsExcludeChannel);
            var dtos = conversations.Select(o => ConversationDTO.From(o));
            return Ok(ApiResult.Success(dtos));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var conversation = await _conversationService.Get(id);
            if (conversation.Type == ConversationTypeEnum.Channel)
            {
                var channel = await _channelService.Get(id);
                return Ok(ApiResult.Success(ChannelDTO.From(channel)));
            }

            return Ok(ApiResult.Success(ConversationDTO.From(conversation)));
        }


        [HttpPost("CreateConversation")]
        public async Task<IActionResult> CreateConversation(CreateConverationDTO createConverationDTO)
        {
            var userId = _userContext.User.UserId;
            var user = await _userStatusService.GetUser(userId);
            var conversationId = await _conversationService.Create(user,
                createConverationDTO.Name,
                createConverationDTO.Type,
                createConverationDTO.MemberIds);

            return Ok(ApiResult.Success(conversationId));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var conversation = await _conversationService.Get(id);
                if (conversation == null)
                {
                    throw new DomainException("ConversationNotExists", "Không tồn tại");
                }

                //kiem tra chỉ delete được khi không có subchannel
                if (conversation.Type == ConversationTypeEnum.Channel)
                {
                    var subchannels = await _dbContext.Channels
                        .Where(o => o.AncestorIds != null
                                && o.AncestorIds.Contains(conversation.Id))
                        .ToListAsync();
                    if (subchannels.Any())
                    {
                        throw new Exception("Không thể xóa kênh này trước khi xóa các kênh con");
                    }
                }

                await _conversationService.Delete(conversation);

                return Ok(ApiResult.Success(null));
            }
            catch (Exception ex)
            {
                return Ok(ApiResult.Error(ex.Message));
            }
        }

        //member 
        [HttpPost("AddMembers")]
        public async Task<IActionResult> AddMembers(AddMembersDTO addMembersDTO)
        {
            var userId = _userContext.User.UserId;
            var user = await _userStatusService.GetUser(userId);
            var conversation = await _conversationService.Get(addMembersDTO.ConversationId);

            //TODO: check user have permission to addMembers 
            var members = await _conversationService.AddMembers(conversation, addMembersDTO.MemberIds);

            return Ok(ApiResult.Success(members));
        }

        [HttpPost("RemoveMember")]
        public async Task<IActionResult> RemoveMember(RemoveMemberDTO removeMemberDTO)
        {
            var userId = _userContext.User.UserId;
            var user = await _userStatusService.GetUser(userId);
            var conversation = await _conversationService.Get(removeMemberDTO.ConversationId);

            //TODO: check user have permission to remove member 

            var removedUser = await _userStatusService.GetUser(removeMemberDTO.UserMemberId);
            await _conversationService.RemoveMember(conversation, removedUser);

            return Ok(ApiResult.Success(null));
        }

        [HttpPost("UpdateMemberRole")]
        public async Task<IActionResult> UpdateMemberRole(UpdateMemberRoleDTO updateMemberRoleDTO)
        {
            var userId = _userContext.User.UserId;
            var user = await _userStatusService.GetUser(userId);
            var conversation = await _conversationService.Get(updateMemberRoleDTO.ConversationId);

            //TODO: check user have permission to UpdateMemberRole

            var updatedUser = await _userStatusService.GetUser(updateMemberRoleDTO.UserMemberId);
            await _conversationService.UpdateMemberRole(conversation, updatedUser, updateMemberRoleDTO.Role);
            return Ok(ApiResult.Success(null));
        }

        [HttpPost("{id}/Seen")]
        public async Task<IActionResult> Seen(string id)
        {
            try
            {
                var userId = _userContext.User.UserId;
                var user = await _userStatusService.GetUser(userId);
                var conversation = await _conversationService.Get(id);

                if (conversation == null)
                {
                    throw new DomainException("ConversationNotExists", "Không tồn tại");
                }
                var member = conversation.Members.Find(o => o.UserId == userId);
                if (member == null)
                {
                    throw new DomainException("MemberNotExist", "Không tồn tại");
                }

                var lastMessage = conversation.RecentMessages.FirstOrDefault();

                if( member.SeenDate == null ||
                    (lastMessage != null && lastMessage.SentDate >= member.SeenDate))
                {
                    await _conversationService.UpdateUserSeen(conversation, userId);
                }
                
                return Ok(ApiResult.Success(null));
            }
            catch (Exception ex)
            {
                return Ok(ApiResult.Error(ex.Message));
            }
        }

        //message
        [HttpGet("GetMessagesHistory")]
        public async Task<IActionResult> GetMessagesHistory([FromQuery] GetMessagesHistoryDTO getMessageHistoryDTO)
        {
            var userId = _userContext.User.UserId;
            var user = await _userStatusService.GetUser(userId);
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

        [HttpPost("SendMessage")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageDTO sendMessageDTO)
        {
            try
            {

                if (string.IsNullOrWhiteSpace(sendMessageDTO.Content)
                    && (sendMessageDTO.Files == null || sendMessageDTO.Files.Count == 0))
                {
                    throw new Exception("SendMessage parameters is invalid");
                }

                if (string.IsNullOrWhiteSpace(sendMessageDTO.ConversationId)
                    && string.IsNullOrWhiteSpace(sendMessageDTO.UserId))
                {
                    throw new Exception("SendMessage parameters is invalid");
                }

                var userId = _userContext.User.UserId;
                var user = await _userStatusService.GetUser(userId);

               
                var message = await SendInternalMessage(user, sendMessageDTO);

                return Ok(ApiResult.Success(message));
            }
            catch (Exception ex)
            {
                return Ok(ApiResult.Error(ex.Message));
            }
        }

        [HttpPost("SendMessage2Conversations")]
        public async Task<IActionResult> SendMessage2Conversations([FromBody] SendMessage2ConversationsDTO sendMessageDTO)
        {
            try
            {
                _logger.LogInformation($"SendMessage2Conversations : {JsonConvert.SerializeObject(sendMessageDTO)}");
                var conversationIds = sendMessageDTO.ConversationIds;
                if (conversationIds == null || conversationIds.Count == 0)
                {
                    throw new Exception("SendMessage2Conversations ConversationIds is invalid");
                }

                if (string.IsNullOrWhiteSpace(sendMessageDTO.Content)
                   && (sendMessageDTO.Files == null || sendMessageDTO.Files.Count == 0))
                {
                    throw new Exception("SendMessage2Conversations parameters is invalid");
                }

                var messageDtos = conversationIds.Distinct()
                    .Select(conversationId => new SendMessageDTO()
                {
                    Content = sendMessageDTO.Content,
                    ConversationId = conversationId,
                    Files = sendMessageDTO.Files,
                    Properties = sendMessageDTO.Properties
                });

                var userId = _userContext.User.UserId;
                var user = await _userStatusService.GetUser(userId);


                IList<Message> messages = new List<Message>();
                foreach (var msgDto in messageDtos)
                {
                    var message = await this.SendInternalMessage(user, msgDto);
                    messages.Add(message);
                }

                return Ok(ApiResult.Success(messages));
            }
            catch (Exception ex)
            {
                return Ok(ApiResult.Error(ex.Message));
            }
        }

        [HttpPost("SendMessage2Users")]
        public async Task<IActionResult> SendMessage2Users([FromBody] SendMessage2UsersDTO sendMessageDTO)
        {
            try
            {
                _logger.LogInformation($"SendMessage2Users : {JsonConvert.SerializeObject(sendMessageDTO)}");
                var userIds = sendMessageDTO.UserIds;
                if (userIds == null || userIds.Count == 0)
                {
                    throw new Exception("SendMessage2Users UserIds is invalid");
                }

                if (string.IsNullOrWhiteSpace(sendMessageDTO.Content)
                   && (sendMessageDTO.Files == null || sendMessageDTO.Files.Count == 0))
                {
                    throw new Exception("SendMessage parameters is invalid");
                }

                var messageDtos = userIds.Select(userId => new SendMessageDTO()
                {
                    Content = sendMessageDTO.Content,
                    UserId = userId,
                    Files = sendMessageDTO.Files,
                    Properties = sendMessageDTO.Properties
                });

                var userId = _userContext.User.UserId;
                var user = await _userStatusService.GetUser(userId);


                IList<Message> messages = new List<Message>();
                foreach (var msgDto in messageDtos)
                {
                    var message = await this.SendInternalMessage(user, msgDto);
                    messages.Add(message);
                }

                return Ok(ApiResult.Success(messages));
            }
            catch (Exception ex)
            {
                return Ok(ApiResult.Error(ex.Message));
            }
        }

        private async Task<Message> SendInternalMessage(UserStatus sender, SendMessageDTO sendMessageDTO)
        {
            var conversationId = sendMessageDTO.ConversationId;
            if (string.IsNullOrEmpty(sendMessageDTO.ConversationId))
            {
                var receiver = await _userStatusService.GetUser(sendMessageDTO.UserId);
                if (receiver == null)
                {
                    throw new Exception("User is not found");
                }
                conversationId = await _conversationService.Create(sender,
                    "",
                    ConversationTypeEnum.Peer2Peer,
                    new List<string>() { receiver.UserId });
            }
            var conversation = await _conversationService.Get(conversationId);

            //TODO: check user have permission to SendMessage into the Conversation

            var messageType = MessageTypeEnum.Text;
            if (sendMessageDTO.Files != null && sendMessageDTO.Files.Count > 0)
            {
                var aFile = sendMessageDTO.Files.First();
                switch (aFile.FileType)
                {
                    case FileTypeEnum.Image:
                        messageType = MessageTypeEnum.ImageFile;
                        break;
                    case FileTypeEnum.Video:
                        messageType = MessageTypeEnum.VideoFile;
                        break;
                    case FileTypeEnum.Audio:
                        messageType = MessageTypeEnum.AudioFile;
                        break;
                    case FileTypeEnum.TextFile:
                        messageType = MessageTypeEnum.Text;
                        break;
                    case FileTypeEnum.Other:
                    default:
                        messageType = MessageTypeEnum.OtherFile;
                        break;
                }
            }
            var messageId = _idGenerator.GenerateNew();
            var messageFiles = new List<MessageFile>();
            if (sendMessageDTO.Files != null)
            {
                messageFiles = sendMessageDTO.Files.Select(o => new MessageFile()
                {
                    FileId = o.FileId,
                    FileType = o.FileType,
                    FileName = o.FileName,
                    FileUrl = o.FileUrl
                }).ToList();
            }

            Message message = new Message(messageId, messageType, sender.UserId,
                sendMessageDTO.Content,
                messageFiles);
            message.Properites = sendMessageDTO.Properties;

            await _conversationService.AddMessage(conversation, message);
            message = await _conversationService.GetMessageById(messageId);
            return message;
        }
    }
}
