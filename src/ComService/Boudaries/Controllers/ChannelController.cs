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

        private async Task LoadAncestors(IList<ChannelDTO> channels)
        {
            var ancestorIds = new List<string>();
            foreach (var channel in channels)
            {
                if (!string.IsNullOrEmpty(channel.AncestorIds))
                {
                    ancestorIds.AddRange(channel.AncestorIds.Split(',', StringSplitOptions.RemoveEmptyEntries));
                }
            }
            ancestorIds = ancestorIds.Distinct().ToList();
            var ancestors = await _comDbContext.Channels
                .Where(o=> ancestorIds.Contains(o.Id))
                .Select(o=> new AncestorChannelDTO(){ 
                    Id = o.Id, 
                    Name= o.Name, 
                    ChannelLevel = o.ChannelLevel 
                })
                .ToListAsync();

            foreach (var channel in channels)
            {
                if (!string.IsNullOrEmpty(channel.AncestorIds))
                {
                    var ids = channel.AncestorIds.Split(',', StringSplitOptions.RemoveEmptyEntries);
                    var cAncestors = ancestors.Where(o => ids.Contains(o.Id)).ToList();
                    cAncestors.Reverse();
                    channel.Ancestors = cAncestors;
                }
            }
        }

        [HttpGet("GetList")]
        public async Task<IActionResult> GetList([FromQuery] GetListChannelDTO getListDTO)
        {
            var pageOptions = new PageOptions(getListDTO.Offset, getListDTO.PageSize);
            var userId = _userContext.User.UserId;
            _logger.LogInformation($"Get Channels by {userId},roles ${_userContext.UserRoles}");
            
            var user = await _userStatusService.GetUser(userId);
            //TODO: check roles
            var channels = await _channelService.GetChannelsByUser(user, pageOptions);

            //var eventTypes = await _comDbContext.EventTypes.ToListAsync();
            
            var dtos = channels.Select(o => ChannelDTO.From(o)).ToList();

            await LoadAncestors(dtos);

            return Ok(ApiResult.Success(dtos));
        }

        [HttpGet("GetSubChannels/{id}")]
        public async Task<IActionResult> GetSubChannels(string id)
        {

            var subchannels = await _comDbContext.Channels
                  .Where(o => o.AncestorIds != null
                              && o.AncestorIds.Contains(id))
                  .ToListAsync();
            var dtos = subchannels.Select(o => new
            {
                Id = o.Id,
                Name = o.Name,
                ChannelLevel = o.ChannelLevel,
                ParentId = o.ParentId,
                AncestorIds = o.AncestorIds
            });
            return Ok(ApiResult.Success(dtos));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var channel = await _channelService.Get(id);
            if(channel == null)
            {
                return Ok(ApiResult.Error("Channel does not exist"));
            }

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
                createChannelDTO.EventTypeCodes,
                createChannelDTO.ParentId);

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
