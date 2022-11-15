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
using Microsoft.Extensions.Configuration;

namespace FileService.Boudaries.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IFileStorage _fileStorage;
        private readonly IdGenerator _idGenerator;
        private readonly FileDbContext _fileDbContext;
        private readonly IConfiguration _configuration;
        public FileController(IFileStorage fileStorage, 
            IConfiguration configuration,
            IdGenerator idGenerator,
            FileDbContext fileDbContext)
        {
            _configuration = configuration;
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

                var fileType = GetFileType(formFile.ContentType);
                result.Add(new UploadFileResponse()
                {
                    FileId = file.Id,
                    FileName = formFile.FileName,
                    FileContent = formFile.ContentType,
                    FileType = fileType,
                    FileUrl = GetFileUrl(filePathOrUrl, fileType)
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
            if (contentType.StartsWith("audio/"))
            {
                return FileTypeEnum.Audio;
            }
            if (contentType.StartsWith("text/"))
            {
                return FileTypeEnum.TextFile;
            }
            return FileTypeEnum.Other;
        }

        private string GetBaseUrl()
        {
            var hostPath = _configuration.GetValue<string>("HostPath","");
            //TODO: need config file api path
            return $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}{hostPath}";
        }

        private string GetFileUrl(string relativeFilePath, FileTypeEnum fileType)
        {
            var baseUrl = GetBaseUrl();
            var base64Path = relativeFilePath.UrlEncodeBase64String();
            if(fileType == FileTypeEnum.Image)
            {
                return baseUrl + "/image/" + base64Path;
            }
            return baseUrl + "/file/" + base64Path;
        }


        [HttpGet]
        [Route("/file/{key}")]
        public async Task<IActionResult> GetFile([FromRoute] string key, [FromQuery] string download= "")
        {
            var relativePath = key.UrlDecodeBase64String();
            var ext = Path.GetExtension(relativePath);
            var objectStream = await _fileStorage.GetStreamAsync(relativePath);
            if (string.IsNullOrEmpty(download))
            {
                return base.File(objectStream, "application/octet-stream", $"{key}{ext}");
            }
            return base.File(objectStream, "image/jpeg", download);
        }


        [HttpGet]
        [Route("/image/{key}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetImage([FromRoute] string key, [FromQuery] string download = "")
        {
            var relativePath = key.UrlDecodeBase64String();
            var objectStream = await _fileStorage.GetStreamAsync(relativePath);
            if (string.IsNullOrEmpty(download))
            {
                return base.File(objectStream, "image/jpeg");
            }
            return base.File(objectStream, "image/jpeg", download);
        }
    }
}
