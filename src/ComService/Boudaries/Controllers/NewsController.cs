using ComService.DTOs.News;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NextOne.Infrastructure.Core;
using NextOne.Shared.Common;
using NextOne.Shared.Security;
using System.Threading.Tasks;

namespace ComService.Boudaries.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsController : ControllerBase
    {
        private readonly IUserContext _userContext;
        public NewsController(
            IUserContext userContext)
        {

        }
        [AllowAnonymous]
        [HttpGet("GetList")]
        public async Task<IActionResult> GetList([FromQuery] GetListNewsDTO getListDTO)
        {
            var pageOptions = new PageOptions(getListDTO.Offset, getListDTO.PageSize);
           
            return Ok(ApiResult.Success(null));
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
           
            return Ok(ApiResult.Success(null));
        }

        [HttpPost()]
        public async Task<IActionResult> CreateNews(CreateNewsDTO newsDTO)
        {
            var userId = _userContext.User.UserId;
          

            return Ok(ApiResult.Success(null));
        }

        [HttpPost("update/{id}")]
        public async Task<IActionResult> UpdateNews(UpdateNewsDTO newsDTO)
        {
            var userId = _userContext.User.UserId;


            return Ok(ApiResult.Success(null));
        }

        [HttpPost("publish/{id}")]
        public async Task<IActionResult> Publish([FromQuery] string id)
        {
            var userId = _userContext.User.UserId;


            return Ok(ApiResult.Success(null));
        }

        [HttpPost("unpublish/{id}")]
        public async Task<IActionResult> UnPublish([FromQuery] string id)
        {
            var userId = _userContext.User.UserId;


            return Ok(ApiResult.Success(null));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromQuery] string id)
        {
          
            return Ok(ApiResult.Success(null));
        }
    }
}
