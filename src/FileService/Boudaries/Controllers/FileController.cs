using FileService.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileService.Boudaries.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Post([FromForm] List<IFormFile> files, [FromForm] string feature)
        {
            var result = new List<UploadFileResponse>();
            return Ok(result);
        }
    }
}
