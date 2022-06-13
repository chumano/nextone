using ComService.Domain;
using ComService.Domain.Services;
using ComService.DTOs.Channel;
using ComService.DTOs.Event;
using ComService.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    public class ChannelController : ControllerBase
    {
        private readonly ILogger<ChannelController> _logger;
        private readonly IUserContext _userContext;
        private readonly IUserStatusService _userStatusService;
        private readonly IdGenerator _idGenerator;
        private readonly IChannelService _channelService;
        private readonly ComDbContext _comDbContext;
        public ChannelController(
            ILogger<ChannelController> logger,
            IUserContext userContext,
            IdGenerator idGenerator,
            IUserStatusService userService,
            IChannelService channelService,
            ComDbContext comDbContext)
        {
            _logger = logger;
            _userContext = userContext;
            _idGenerator = idGenerator;
            _userStatusService = userService;
            _channelService = channelService;
            _comDbContext = comDbContext;
        }


        [HttpGet("GetList")]
        public async Task<IActionResult> GetList([FromQuery] GetListChannelDTO getListDTO)
        {
            var pageOptions = new PageOptions(getListDTO.Offset, getListDTO.PageSize);
            var userId = _userContext.User.UserId;
            var user = await _userStatusService.GetUser(userId);
            var channels = await _channelService.GetChannelsByUser(user,
                pageOptions);

            //var eventTypes = await _comDbContext.EventTypes.ToListAsync();

            var dtos = channels.Select(o => ChannelDTO.From(o));
            return Ok(ApiResult.Success(dtos));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var channel = await _channelService.Get(id);

            return Ok(ApiResult.Success(ChannelDTO.From(channel)));
        }

        [HttpPost("CreateChannel")]
        public async Task<IActionResult> CreateChannel([FromBody] CreateChannelDTO createChannelDTO)
        {
            var userId = _userContext.User.UserId;
            var user = await _userStatusService.GetUser(userId);
            var channelId = await _channelService.Create(user,
                createChannelDTO.Name,
                createChannelDTO.MemberIds,
                createChannelDTO.EventTypeCodes);

            return Ok(ApiResult.Success(channelId));
        }

        [HttpPost("UpdateEventTypes")]
        public async Task<IActionResult> UpdateEventTypes([FromBody] UpdateEventTypesChannelDTO updateDTO)
        {
            var userId = _userContext.User.UserId;
            var user = await _userStatusService.GetUser(userId);

            var channel = await _channelService.Get(updateDTO.ChannelId);

            await _channelService.UpdateEventTypes(channel,
                updateDTO.Name,
                updateDTO.EventTypeCodes);

            return Ok(ApiResult.Success(null));
        }

        //events
        [HttpPost("SendEvent")]
        public async Task<IActionResult> SendEvent([FromBody] SendEventDTO sendEventDTO)
        {
            var userId = _userContext.User.UserId;
            var user = await _userStatusService.GetUser(userId);
            //TODO : SendEvent
            var eventType = await _comDbContext.EventTypes.FindAsync(sendEventDTO.EventTypeCode);
            if (eventType==null)
            {
                throw new Exception($"{sendEventDTO.EventTypeCode} is invalid");
            }

            //get channels allow event code
            var channels = await _channelService.GetChannelsByEventCode(sendEventDTO.EventTypeCode);
            if (!channels.Any())
            {
                throw new Exception($"No channels for event type {eventType.Name}");
            }

            //create event for each channel
            foreach (var channel in channels)
            {
                var evtId = _idGenerator.GenerateNew();
                var files = sendEventDTO.Files.Select(o => new EventFile()
                {
                    EventId = evtId,
                    FileId = o.FileId,
                    FileType = o.FileType,
                    FileName = o.FileName,
                    FileUrl = o.FileUrl
                }).ToList();

                var nEvent = new Event(evtId,
                    sendEventDTO.Content,
                    eventType,
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

        [HttpGet("GetChannelEventsHistory")]
        public async Task<IActionResult> GetChannelEventsHistory(GetEventsHistoryDTO getEventsDTO)
        {
            var userId = _userContext.User.UserId;
            var user = await _userStatusService.GetUser(userId);
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
