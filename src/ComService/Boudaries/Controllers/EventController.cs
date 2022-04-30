using ComService.Domain;
using ComService.Domain.Services;
using ComService.DTOs.Event;
using Microsoft.AspNetCore.Http;
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
    [Route("[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {

        private readonly ILogger<EventController> _logger;
        private readonly IUserContext _userContext;
        private readonly IUserService _userService;
        private readonly IdGenerator _idGenerator;
        private readonly IChannelService _channelService;
        private readonly IConversationService _conversationService;
        public EventController(
            ILogger<EventController> logger,
            IUserContext userContext,
            IdGenerator idGenerator,
            IUserService userService,
            IChannelService channelService,
            IConversationService conversationService)
        {
            _logger = logger;
            _userContext = userContext;
            _idGenerator = idGenerator;
            _userService = userService;
            _channelService = channelService;
            _conversationService = conversationService;
        }

        [HttpPost("SendEvent")]
        public async Task<IActionResult> SendEvent(SendEventDTO sendEventDTO)
        {
            var userId = _userContext.User.UserId;
            var user = await _userService.GetUser(userId);
            //TODO : SendEvent
            //get channels allow event code
            var channels = await _channelService.GetChannelsByEventCode(sendEventDTO.EventTypeCode);
            if (!channels.Any())
            {
                throw new Exception($"{sendEventDTO.EventTypeCode} is invalid");
            }
            
            //create event for each channel
            foreach(var channel in channels)
            {
                var evtId = _idGenerator.GenerateNew();
                var files = sendEventDTO.Files.Select(o => new EventFile()
                {
                    EventId = evtId,
                    FileId = o.FileId,
                    FileType = o.FileType,
                    FileUrl = o.FileUrl
                }).ToList();
                var nEvent = new Event(evtId,
                    sendEventDTO.Content,
                    sendEventDTO.EventTypeCode,
                    userId,
                    sendEventDTO.OccurDate,
                    sendEventDTO.Address,
                    sendEventDTO.Lat,
                    sendEventDTO.Lon,
                    files
                    );

                await _channelService.AddEvent(channel, nEvent);
            }

            return Ok(ApiResult.Success(null));
        }

        [HttpGet("GetEventsHistory")]
        public async Task<IActionResult> GetEventsHistory(GetEventsHistoryDTO getEventsDTO)
        {
            var userId = _userContext.User.UserId;
            var user = await _userService.GetUser(userId);
            var channel = await _channelService.Get(getEventsDTO.ChannelId);

            //TODO: check user have permission to GetEventsHistory
            var evts = await _channelService.GetEventsHistory(channel,
                getEventsDTO.BeforeDate,
                new PageOptions()
                {
                    Offset = getEventsDTO.Offset,
                    PageSize = getEventsDTO.PageSize > 0 ? getEventsDTO.PageSize : PageOptions.DefaultPageSize
                });

            return Ok(ApiResult.Success(evts));
        }
    }
}
