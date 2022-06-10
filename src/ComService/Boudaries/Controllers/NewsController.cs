using ComService.Domain;
using ComService.DTOs;
using ComService.DTOs.News;
using ComService.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NextOne.Infrastructure.Core;
using NextOne.Shared.Common;
using NextOne.Shared.Security;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Boudaries.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class NewsController : ControllerBase
    {
        private readonly IUserContext _userContext;
        private readonly ComDbContext _dbContext;
        protected readonly IdGenerator _idGenerator;
        public NewsController(
            IUserContext userContext,
            IdGenerator idGenerator,
            ComDbContext comDbContext)
        {
            _userContext = userContext;
            _idGenerator = idGenerator;
            _dbContext = comDbContext;
        }

        [AllowAnonymous]
        [HttpGet("GetList")]
        public async Task<IActionResult> GetList([FromQuery] GetListNewsDTO getListDTO)
        {
            var userId = _userContext.User.UserId;
            var pageOptions = new PageOptions(getListDTO.Offset, getListDTO.PageSize);
            var query = _dbContext.News.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(getListDTO.TextSearch))
            {
                var textSearch = getListDTO.TextSearch.Trim();
                query = query.Where(o =>
                    o.Title.Contains(textSearch)
                    || o.Description.Contains(textSearch)
                    || o.ImageDescription.Contains(textSearch)
                    || o.PublishedUserName.Contains(textSearch)
                    );
            }

            if (!_userContext.IsAuthenticated)
            {
                query = query.Where(o => o.IsPublished == true);
            }
            else
            {
                if (getListDTO.PublishState != null && getListDTO.PublishState != YesNoEnum.All)
                {
                    bool isPublished = getListDTO.PublishState == YesNoEnum.Yes;
                    query = query.Where(o => o.IsPublished == isPublished);
                }
            }

            if (getListDTO.FromDate != null)
            {
                query = query.Where(o => o.PublishedDate >= getListDTO.FromDate);
            }

            if (getListDTO.ToDate != null)
            {
                query = query.Where(o => o.PublishedDate <= getListDTO.ToDate);
            }

            var items = await query
                .OrderByDescending(o => o.PublishedDate)
                .Skip(pageOptions.Offset)
                .Take(pageOptions.PageSize)
                .ToListAsync();

            return Ok(ApiResult.Success(items));
        }

        [AllowAnonymous]
        [HttpGet("Count")]
        public async Task<IActionResult> Count([FromQuery] GetListNewsDTO getListDTO)
        {
            var userId = _userContext.User.UserId;
            var pageOptions = new PageOptions(getListDTO.Offset, getListDTO.PageSize);
            var query = _dbContext.News.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(getListDTO.TextSearch))
            {
                var textSearch = getListDTO.TextSearch.Trim();
                query = query.Where(o => 
                    o.Title.Contains(textSearch)
                    || o.Description.Contains(textSearch)
                    || o.ImageDescription.Contains(textSearch)
                    || o.PublishedUserName.Contains(textSearch)
                    );
            }

            if (!_userContext.IsAuthenticated)
            {
                query = query.Where(o => o.IsPublished == true);
            }
            else
            {
                if (getListDTO.PublishState != null && getListDTO.PublishState != YesNoEnum.All)
                {
                    bool isPublished = getListDTO.PublishState == YesNoEnum.Yes;
                    query = query.Where(o => o.IsPublished == isPublished);
                }
            }

            if (getListDTO.FromDate != null)
            {
                query = query.Where(o => o.PublishedDate >= getListDTO.FromDate);
            }

            if (getListDTO.ToDate != null)
            {
                query = query.Where(o => o.PublishedDate <= getListDTO.ToDate);
            }

            var count = await query.CountAsync();

            return Ok(ApiResult.Success(count));
        }


        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var item = await _dbContext.News.FindAsync(id);
            return Ok(ApiResult.Success(item));
        }

        [HttpPost("CreateNews")]
        public async Task<IActionResult> CreateNews(CreateNewsDTO newsDTO)
        {
            var userId = _userContext.User.UserId;
            var userName = _userContext.User.Name;
            var id = _idGenerator.GenerateNew();
            var aNews = new News()
            {
                Id = id,
                Title = newsDTO.Title,
                Description = newsDTO.Description,
                Content = newsDTO.Content,
                ImageUrl = newsDTO.ImageUrl,
                ImageDescription = newsDTO.ImageDescription,

                IsPublished = false,

                PublishedDate = System.DateTime.Now,
                PublishedBy = userId,
                PublishedUserName = userName,
            };

            _dbContext.News.Add(aNews);
            await _dbContext.SaveChangesAsync();

            return Ok(ApiResult.Success(id));
        }

        [HttpPost("update/{id}")]
        public async Task<IActionResult> UpdateNews(string id, UpdateNewsDTO newsDTO)
        {
            var userId = _userContext.User.UserId;
            var userName = _userContext.User.Name;
            var item = await _dbContext.News.FindAsync(id);
            if (item == null)
            {
                throw new System.Exception($"News Id {id} is not found");
            }

            item.Title = newsDTO.Title;
            item.Description = newsDTO.Description;
            item.Content = newsDTO.Content;
            item.ImageUrl = newsDTO.ImageUrl;
            item.ImageDescription = newsDTO.ImageDescription;

            item.PublishedDate = System.DateTime.Now;
            item.PublishedBy = userId;
            item.PublishedUserName = userName;

            _dbContext.News.Update(item);
            await _dbContext.SaveChangesAsync();

            return Ok(ApiResult.Success(null));
        }

        [HttpPost("publish/{id}")]
        public async Task<IActionResult> Publish(string id)
        {
            var userId = _userContext.User.UserId;
            var userName = _userContext.User.Name;
            var item = await _dbContext.News.FindAsync(id);
            if (item == null)
            {
                throw new System.Exception($"News Id {id} is not found");
            }
            item.IsPublished = true;

            item.PublishedDate = System.DateTime.Now;
            item.PublishedBy = userId;
            item.PublishedUserName = userName;

            _dbContext.News.Update(item);
            await _dbContext.SaveChangesAsync();
            return Ok(ApiResult.Success(null));
        }

        [HttpPost("unpublish/{id}")]
        public async Task<IActionResult> UnPublish( string id)
        {
            var userId = _userContext.User.UserId;
            var userName = _userContext.User.Name;
            var item = await _dbContext.News.FindAsync(id);
            if (item == null)
            {
                throw new System.Exception($"News Id {id} is not found");
            }
            item.IsPublished = false;

            item.PublishedDate = System.DateTime.Now;
            item.PublishedBy = userId;
            item.PublishedUserName = userName;

            _dbContext.News.Update(item);
            await _dbContext.SaveChangesAsync();

            return Ok(ApiResult.Success(null));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var item = await _dbContext.News.FindAsync(id);
            if(item == null)
            {
                throw new System.Exception($"News Id {id} is not found");
            }
            _dbContext.News.Remove(item);
            await _dbContext.SaveChangesAsync();

            return Ok(ApiResult.Success(null));
        }
    }
}
