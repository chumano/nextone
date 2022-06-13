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
        private readonly ComDbContext _comDbContext;
        public EventController(
            ILogger<EventController> logger,
            IUserContext userContext,
            ComDbContext comDbContext)
        {
            _logger = logger;
            _userContext = userContext;
            _comDbContext = comDbContext;
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
            if (filterDTO?.EventTypeCodes != null && filterDTO.EventTypeCodes.Any())
            {
                query = query.Where(o => filterDTO.EventTypeCodes.Contains(o.EventTypeCode));
            }
            
            var items = await query
                .Include(o=>o.EventType)
                .Include(o => o.UserSender)
                .OrderByDescending(o=>o.CreatedDate)
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
                .ToListAsync();
            return Ok(ApiResult.Success(items));
        }

    }
}
