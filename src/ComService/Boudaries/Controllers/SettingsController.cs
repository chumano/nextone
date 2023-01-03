﻿using ComService.Domain;
using ComService.Domain.Services;
using ComService.DTOs.Settings;
using ComService.Infrastructure;
using ComService.Infrastructure.AppSettings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NextOne.Infrastructure.Core;
using NextOne.Shared.Common;
using NextOne.Shared.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Boudaries.Controllers
{
    [Authorize]
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
        private readonly IOptionsMonitor<ApplicationOptions> _optionsApplication;

        public SettingsController(
            ILogger<SettingsController> logger,
            IOptionsMonitor<ApplicationOptions> optionsApplication,
            IUserContext userContext,
            IdGenerator idGenerator,
            IUserStatusService userService,
            IChannelService channelService,
            ComDbContext comDbContext)
        {
            _logger = logger;
            _optionsApplication = optionsApplication;
            _userContext = userContext;
            _idGenerator = idGenerator;
            _userService = userService;
            _channelService = channelService;
            _comDbContext = comDbContext;
        }

        [HttpGet("Application")]
        public async Task<IActionResult> GetApplicationSettings()
        {
            return Ok(ApiResult.Success(_optionsApplication.CurrentValue));
        }

        [HttpGet()]
        public async Task<IActionResult> GetSystemSettings()
        {
            var userId = _userContext.User.UserId;
            //var user = await _userService.GetUser(userId);
            var items = await _comDbContext.Settings.AsQueryable()
                .ToListAsync();
            return Ok(ApiResult.Success(items));
        }

        [HttpPost("Update")]
        public async Task<IActionResult> UpdateSettings(UpdateSettingsDTO dto)
        {
            try
            {
                var userId = _userContext.User.UserId;
                var user = await _userService.GetUser(userId);
                var existSettings = await _comDbContext.Settings.FindAsync(dto.Code);
                if (existSettings == null)
                {
                    throw new Exception($"{dto.Code} is not found");
                }

                existSettings.Value = dto.Value;

                _comDbContext.Settings.Update(existSettings);
                await _comDbContext.SaveChangesAsync();
                return Ok(ApiResult.Success(existSettings));
            }
            catch (Exception ex)
            {
                return Ok(ApiResult.Error(ex.Message));
            }
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
                var isUsed = await _comDbContext.Set<ChannelEventType>().AnyAsync(o => o.EventTypeCode == code);
                if (isUsed)
                {
                    throw new Exception($"Loại sự kiện đang được dùng");
                }

                //isUsed = await _comDbContext.Events.AnyAsync(o => o.EventTypeCode == code);
                //if (isUsed)
                //{
                //    throw new Exception($"Loại sự kiện đang được dùng");
                //}

                isUsed = await _comDbContext.Set<ChannelEvent>().AnyAsync(o => o.Event.EventTypeCode == code);
                if (isUsed)
                {
                    throw new Exception($"Loại sự kiện đang được dùng");
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
