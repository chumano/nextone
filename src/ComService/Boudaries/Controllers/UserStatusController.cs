using ComService.DTOs.UserStatus;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Boudaries.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserStatusController : ControllerBase
    {
        [HttpGet("{id}")]
        public IActionResult GetCurrentUserStatus()
        {
            throw new NotImplementedException();
        }

        [HttpGet("GetHistoryUserLocation")]
        public IActionResult GetHistoryUserLocation(GetHistoryUserLocationDTO getHistoryUserLocationDTO)
        {
            throw new NotImplementedException();
        }

        [HttpPost("UpdateUserLocation")]
        public IActionResult UpdateUserLocation(UpdateUserLocationDTO updateUserLocationDTO)
        {
            throw new NotImplementedException();
        }
    }
}
