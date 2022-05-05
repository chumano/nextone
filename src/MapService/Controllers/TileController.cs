using MapService.MapSources;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MapService.Controllers
{
    [Route("tms")]
    public class TileController : Controller
    {
        [HttpGet("1.0.0/{tilesetName}/{z}/{x}/{y}.{formatExtension}")]
        public async Task<IActionResult> GetTileAsync(string tilesetName, int x, int y, int z, string formatExtension)
        {
            if (String.IsNullOrEmpty(tilesetName))
            {
                return BadRequest();
            }
            try
            {
                var tileSource = TileSources.GetTileSource(tilesetName);
                // TODO: check formatExtension == tileset.Configuration.Format

                //kiểm tra tile này đã vẽ chửa
                //Check file exists trong thư mục quy định
                // vẽ rồi nhưng có thể styles đã update, thì style update thì tăng version của map lên
                var data = await tileSource.GetTileAsync(x, y, z);
                if (data != null)
                {
                    return File(data, tileSource.ContentType);
                }
                else
                {
                    return NotFound();
                }

            }
            catch (Exception ex)
            {
                return NotFound($"Specified tileset '{tilesetName}' not exists/has error on server. {ex.Message}");
            }
        }
    }
}
