using MapService.Domain;
using MapService.Domain.Repositories;
using MapService.DTOs.IconSymbol;
using MapService.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MapService.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SymbolController : ControllerBase
    {
        private readonly IIconSymbolRepository _symbolRepository;
        public SymbolController(IIconSymbolRepository symbolRepository)
        {
            _symbolRepository = symbolRepository;
        }

        // GET: api/<Symbol>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var items = await _symbolRepository.Symbols
                .ToListAsync();

            return Ok(items.Select(o => SymbolDTO.From(o)));
        }

        // GET api/<Symbol>/5
        [HttpGet("{name}")]
        public async Task<IActionResult> Get(string name)
        {
            var item = await _symbolRepository.Get(name);
            return Ok(SymbolDTO.From(item));
        }

        // POST api/<Symbol>
        [HttpPost]
        public async Task<IActionResult> Post([FromForm] CreateSymbolDTO createSymbolDTO)
        {
            var ext = Path.GetExtension(createSymbolDTO.File.FileName);
            if (ext.ToLower() != ".png" && ext.ToLower() != ".jpg")
            {
                throw new Exception("Need to ShapeFile png/jpg");
            }

            var existNameObj = await _symbolRepository.Symbols
                    .Where(o => o.Name == createSymbolDTO.Name)
                    .FirstOrDefaultAsync();

            if (existNameObj != null)
            {
                throw new Exception($"Symbol Name is in use");
            }
            var filePath = await SaveFile(createSymbolDTO.File, "Data/Uploads");
            byte[] imgBytes;
            int width =0, height=0;
            using (var image = new Bitmap(filePath))
            {
                imgBytes = ImageHelper.ImageToByteArray(image);
                width = image.Width;
                height = image.Height;
            }

            var symbol = new IconSymbol(createSymbolDTO.Name,
                width, height, imgBytes);

            _symbolRepository.Add(symbol);
            await _symbolRepository.SaveChangesAsync();

            System.IO.File.Delete(filePath);

            return Ok(SymbolDTO.From(symbol));
        }

        private async Task<string> SaveFile(IFormFile file, string fileFolder)
        {
            var name_only = Path.GetFileNameWithoutExtension(file.FileName);
            var ext = Path.GetExtension(file.FileName);
            var file_name = string.Format("{0}{1}", name_only, ext);

            Directory.CreateDirectory(fileFolder);

            string path = Path.Combine(fileFolder, file_name);
            using (Stream fileStream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return path;
        }

        [HttpDelete("{name}")]
        public async Task<IActionResult> Delete(string name)
        {
            var existNameObj = await _symbolRepository.Symbols
                    .Where(o => o.Name == name)
                    .FirstOrDefaultAsync();

            if (existNameObj != null)
            {
                throw new Exception($"Symbol Name is not found");
            }

            _symbolRepository.Delete(existNameObj);
            await _symbolRepository.SaveChangesAsync();


            return Ok(SymbolDTO.From(existNameObj));
        }
    }
}
