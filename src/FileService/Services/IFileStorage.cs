using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace FileService.Services
{
    public interface IFileStorage
    {
        Task<string> SaveAsync(IFormFile formFile);
        Task<Stream> GetStreamAsync(string filePathOrUrl);

        Task DeleteAsync(string filePathOrUrl);
    }
}
