using ComService.Domain.Services;
using ComService.DTOs.Settings;
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
    public class SettingsController : ControllerBase
    {
        private readonly ILogger<SettingsController> _logger;
        private readonly IUserContext _userContext;
        private readonly IUserStatusService _userService;
        private readonly IdGenerator _idGenerator;
        private readonly IChannelService _channelService;
        private readonly ComDbContext _comDbContext;
        public SettingsController(
            ILogger<SettingsController> logger,
            IUserContext userContext,
            IdGenerator idGenerator,
            IUserStatusService userService,
            IChannelService channelService,
            ComDbContext comDbContext)
        {
            _logger = logger;
            _userContext = userContext;
            _idGenerator = idGenerator;
            _userService = userService;
            _channelService = channelService;
            _comDbContext = comDbContext;
        }

        [HttpGet("GetEventTypes")]
        public async Task<IActionResult> GetList()
        {
            var userId = _userContext.User.UserId;
            var user = await _userService.GetUser(userId);
            var items = await _comDbContext.EventTypes.AsQueryable()
                .ToListAsync();
            return Ok(ApiResult.Success(items));
        }



        [HttpPost("CreateEventType")]
        public async Task<IActionResult> CreateEventType(CreateEventTypeDTO createEventTypeDTO)
        {
            try
            {
                var userId = _userContext.User.UserId;
                var user = await _userService.GetUser(userId);
                var existsEventType = await _comDbContext.EventTypes.FindAsync(createEventTypeDTO.Code);
                if (existsEventType != null)
                {
                    throw new Exception($"{createEventTypeDTO.Code} exists");
                }

                var eventType = new Domain.EventType()
                {
                    Code = createEventTypeDTO.Code,
                    Name = createEventTypeDTO.Name,
                    IconUrl = createEventTypeDTO.IconUrl,
                    Note = createEventTypeDTO.Note
                };
                _comDbContext.EventTypes.Add(eventType);
                await _comDbContext.SaveChangesAsync();
                return Ok(ApiResult.Success(eventType));
            }
            catch (Exception ex)
            {
                return Ok(ApiResult.Error(ex.Message));
            }
        }

        [HttpPost("UpdateEventType")]
        public async Task<IActionResult> UpdateEventType(UpdateEventTypeDTO updateDTO)
        {
            try
            {
                var userId = _userContext.User.UserId;
                var user = await _userService.GetUser(userId);
                var eventType = await _comDbContext.EventTypes.FindAsync(updateDTO.Code);
                if (eventType == null)
                {
                    throw new Exception($"{updateDTO.Code} is not found");
                }

                eventType.Name = updateDTO.Name;
                eventType.IconUrl = updateDTO.IconUrl;
                eventType.Note = updateDTO.Note;

                _comDbContext.EventTypes.Update(eventType);
                await _comDbContext.SaveChangesAsync();
                return Ok(ApiResult.Success(eventType));
            }
            catch (Exception ex)
            {
                return Ok(ApiResult.Error(ex.Message));
            }
        }

        [HttpDelete("EventType/{code}")]
        public async Task<IActionResult> DeleteEventType(string code)
        {
            try
            {
                var eventType = await _comDbContext.EventTypes.FindAsync(code);
                if (eventType == null)
                {
                    throw new Exception($"{code} is not found");
                }

                _comDbContext.EventTypes.Remove(eventType);
                await _comDbContext.SaveChangesAsync();

                return Ok(ApiResult.Success(null));
            }
            catch (Exception ex)
            {
                return Ok(ApiResult.Error(ex.Message));
            }
        }
    }
}
