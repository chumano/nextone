using ComService.Domain;
using ComService.Domain.DomainEvents;
using ComService.Domain.Repositories;
using ComService.Domain.Services;
using ComService.DTOs.Event;
using ComService.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NextOne.Infrastructure.Core;
using NextOne.Shared.Bus;
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
    public class EventController : ControllerBase
    {
        private readonly ILogger<EventController> _logger;
        private readonly IUserContext _userContext;
        private readonly ComDbContext _comDbContext;
        private readonly IUserStatusService _userStatusService;
        private readonly IChannelService _channelService;
        private readonly IEventRepository _eventRepository;
        private readonly IdGenerator _idGenerator;
        protected readonly IBus _bus;

        public EventController(
            ILogger<EventController> logger,
            IUserContext userContext,
            IdGenerator idGenerator,
            IBus bus,
            IUserStatusService userService,
            IChannelService channelService,
            IEventRepository eventRepository,
            ComDbContext comDbContext)
        {
            _logger = logger;
            _userContext = userContext;
            _idGenerator = idGenerator;
            _bus = bus;
            _comDbContext = comDbContext;
            _channelService = channelService;
            _eventRepository = eventRepository;
            _userStatusService = userService;
        }

        //events
        [HttpPost("SendEvent")]
        public async Task<IActionResult> SendEvent([FromBody] SendEventDTO sendEventDTO)
        {
            var userId = _userContext.User.UserId;
            var user = await _userStatusService.GetUser(userId);

            var eventType = await _comDbContext.EventTypes.FindAsync(sendEventDTO.EventTypeCode);
            if (eventType == null)
            {
                throw new Exception($"{sendEventDTO.EventTypeCode} is invalid");
            }

            //get channels allow event code
            var channels = await _channelService.GetChannelsByEventCode(sendEventDTO.EventTypeCode);
            if (!channels.Any())
            {
                throw new Exception($"No channels for event type {eventType.Name}");
            }

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


            _eventRepository.Add(nEvent);

            //create event for each channel
            foreach (var channel in channels)
            {
                await _channelService.AddEvent(channel, nEvent);
            }
            //await _eventRepository.SaveChangesAsync();
            return Ok(ApiResult.Success(null));
        }

        [HttpGet("GetEventTypesForMe")]
        public async Task<IActionResult> GetEventTypesForMe()
        {
            var userId = _userContext.User.UserId;
            var items = await GetEventTypeForUser(userId);
            return Ok(ApiResult.Success(items));
        }

        private async Task<IEnumerable<EventType>> GetEventTypeForUser(string userId)
        {
            var query = _comDbContext.Channels.AsNoTracking()
               .Include(o => o.Members)
               .Include(o => o.AllowedEventTypes)
                   .ThenInclude(o => o.EventType)
               .Where(o => o.Members.Any(m => m.UserId == userId))
               .Select(o => o.AllowedEventTypes);
            //.Select(o => o.EventType);

            var items = await query.ToListAsync();
            return items.SelectMany(o => o).Select(o => o.EventType)
                .DistinctBy(o => o.Code);
        }

        //get all events by eventTypes, in current date
        [HttpGet("GetEventsForMap")]
        public async Task<IActionResult> GetEventsForMap([FromQuery] GetEventsForMapDTO filterDTO)
        {
            var userId = _userContext.User.UserId;
            DateTime startDateTime = DateTime.Today; //Today at 00:00:00
            DateTime endDateTime = DateTime.Today.AddDays(1);
            var query = _comDbContext.Events.AsNoTracking()
                .Where(o => o.CreatedDate >= startDateTime && o.CreatedDate < endDateTime)
                ;

            var EventTypeCodes = new List<string>();
            if (filterDTO?.EventTypeCodes != null && filterDTO.EventTypeCodes.Any())
            {
                EventTypeCodes = filterDTO.EventTypeCodes;
            }
            else
            {
                var eventTypes = await GetEventTypeForUser(userId);
                EventTypeCodes = eventTypes.Select(o => o.Code).ToList();
            }

            query = query.Where(o => EventTypeCodes.Contains(o.EventTypeCode));

            var items = await query
                .Include(o => o.EventType)
                .Include(o => o.UserSender)
                .Include(o => o.Files)
                .OrderByDescending(o => o.CreatedDate)
                .ToListAsync();
            return Ok(ApiResult.Success(items));
        }


        //get events by user, with pagination
        [HttpGet("GetEventsByMe")]
        public async Task<IActionResult> GetEventsByMe([FromQuery] GetEventsByMeDTO filterDTO)
        {
            var userId = _userContext.User.UserId;
            var pageOptions = new PageOptions(filterDTO.Offset, filterDTO.PageSize);

            var query = _comDbContext.Events.AsNoTracking()
                .Where(o => o.UserSenderId == userId)
                ;

            var items = await query
                .OrderByDescending(o => o.CreatedDate)
                .Skip(filterDTO.Offset)
                .Take(filterDTO.PageSize)
                .Include(o => o.EventType)
                .Include(o => o.UserSender)
                .Include(o => o.Files)
                .ToListAsync();
            return Ok(ApiResult.Success(items));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(string id)
        {
            try
            {
                var evt = await _comDbContext.Events.FindAsync(id);

                if (evt == null)
                {
                    return Ok(ApiResult.Error("Event does not exist"));
                }

                //find channelEvents
                var channelEvents = await _comDbContext.Set<ChannelEvent>()
                    .Where(o => o.EventId == id)
                    .ToListAsync();

                //find messageEvents
                var messages = await _comDbContext.Messages
                    .Where(o => o.EventId == id)
                    .ToListAsync();


                _comDbContext.Set<ChannelEvent>().RemoveRange(channelEvents);
                _comDbContext.Messages.RemoveRange(messages);
                _comDbContext.Events.Remove(evt);

                await _comDbContext.SaveChangesAsync();

                await _bus.Publish(new EventDeleted());

                return Ok(ApiResult.Success(null));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"EventController DeleteEvent error: {ex.Message}");
                return Ok(ApiResult.Error(ex.Message));
            }
        }
    }
}
