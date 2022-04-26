using FileService.Infrastructure.AppSettings;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace FileService.Services
{
    public class LocalFileStorage : IFileStorage
    {
        private readonly IOptionsMonitor<LocalFileSettings> _optionMontior;
        private readonly IHostEnvironment _hostEnvironment;
        public LocalFileStorage(IOptionsMonitor<LocalFileSettings> optionMontior, IHostEnvironment hostEnvironment)
        {
            _optionMontior = optionMontior;
            _hostEnvironment = hostEnvironment;
        }

        private string FileFolder
        {
            get { return _optionMontior.CurrentValue.FileFolder; }
        }

        private string GetRealPath(string relativePath){
            return Path.Combine(_hostEnvironment.ContentRootPath ,FileFolder, relativePath);
        }

        public Task DeleteAsync(string filePathOrUrl)
        {
            var path = GetRealPath(filePathOrUrl);
            if (File.Exists(path))
            {
                File.Delete(path);
            }
            return Task.CompletedTask;
        }

        public async Task<Stream> GetStreamAsync(string filePathOrUrl)
        {
            var path = GetRealPath(filePathOrUrl);
            if (!File.Exists(path))
            {
                throw new FileNotFoundException($"{filePathOrUrl} is not found");
            }
            return File.OpenRead(path);
        }

        public async Task<string> SaveAsync(IFormFile formFile)
        {
            var ext = Path.GetExtension(formFile.FileName);

            var dateFolder = DateTime.Now.ToString("ddMMyyyy");

            var fileName = $"{Guid.NewGuid().ToString()}{ext}";
            var relativePath = Path.Combine(dateFolder, fileName);

            var savePath = GetRealPath(relativePath);

            var folder = Path.GetDirectoryName(savePath);
            Directory.CreateDirectory(folder);

            using (Stream fileStream = new FileStream(savePath, FileMode.Create))
            {
                await formFile.CopyToAsync(fileStream);
            }
            return relativePath;
        }
    }
}
