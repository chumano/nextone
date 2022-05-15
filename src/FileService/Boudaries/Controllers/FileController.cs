using FileService.Domain;
using FileService.DTOs;
using FileService.Infrastructure;
using FileService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NextOne.Shared.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NextOne.Shared.Extenstions;
using System.IO;
using FileInfo = FileService.Domain.FileInfo;
using NextOne.Infrastructure.Core;
using SharedDomain.Common;

namespace FileService.Boudaries.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IFileStorage _fileStorage;
        private readonly IdGenerator _idGenerator;
        private readonly FileDbContext _fileDbContext;
        public FileController(IFileStorage fileStorage, 
            IdGenerator idGenerator,
            FileDbContext fileDbContext)
        {
            _fileStorage = fileStorage;
            _idGenerator = idGenerator;
            _fileDbContext = fileDbContext;
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromForm] List<IFormFile> files, [FromForm] string feature)
        {
            var result = new List<UploadFileResponse>();
           
            foreach (var formFile in files)
            {
                var filePathOrUrl = await _fileStorage.SaveAsync(formFile);
                var file = new FileInfo()
                {
                    Id = _idGenerator.GenerateNew(),
                    FileName = formFile.FileName,
                    FileType = formFile.ContentType,
                    CreatedDate = DateTime.Now,
                    SystemFeature = feature,
                    RelativePath = filePathOrUrl,
                    CreatedBy = null
                };

                _fileDbContext.Files.Add(file);

                //local
                result.Add(new UploadFileResponse()
                {
                    FileId = file.Id,
                    FileName = formFile.FileName,
                    FileContent = formFile.ContentType,
                    FileType = GetFileType(formFile.ContentType),
                    FileUrl = GetFileUrl(filePathOrUrl)
                });
            }
            await _fileDbContext.SaveChangesAsync();
            return Ok(ApiResult.Success(result));
        }

        private FileTypeEnum GetFileType(string contentType)
        {
            if (contentType.StartsWith("image/"))
            {
                return FileTypeEnum.Image;
            }
            if (contentType.StartsWith("video/"))
            {
                return FileTypeEnum.Video;
            }
            if (contentType.StartsWith("text/"))
            {
                return FileTypeEnum.TextFile;
            }
            return FileTypeEnum.Other;
        }

        private string GetBaseUrl()
        {
            return $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}";
        }

        private string GetFileUrl(string relativeFilePath)
        {
            var baseUrl = GetBaseUrl();
            var base64Path = relativeFilePath.UrlEncodeBase64String();
            return baseUrl + "/file/" + base64Path;
        }


        [HttpGet]
        [Route("/file/{key}")]
        public async Task<IActionResult> GetFile([FromRoute] string key)
        {
            var relativePath = key.UrlDecodeBase64String();
            var ext = Path.GetExtension(relativePath);
            var objectStream = await _fileStorage.GetStreamAsync(relativePath);
            return base.File(objectStream, "application/octet-stream", $"{key}{ext}");
        }


        [HttpGet]
        [Route("/image/{key}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetImage([FromRoute] string key)
        {
            var relativePath = key.UrlDecodeBase64String();
            var objectStream = await _fileStorage.GetStreamAsync(relativePath);
            return base.File(objectStream, "image/jpeg");
        }
    }
}
