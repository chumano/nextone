using BruTile;
using BruTile.Predefined;
using MapService.Domain.Services;
using MapService.Infrastructure.AppSettings;
using MapService.MapSources;
using MapService.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Drawing.Imaging;
using System.Linq;
using System.Threading.Tasks;

namespace MapService.Controllers
{
    [Route("tms")]
    public class TileController : Controller
    {
        private static GlobalSphericalMercator _schema = new GlobalSphericalMercator("image/png", YAxis.TMS, 0, 19);

        private readonly IMapService _mapService;
        private readonly IMapRender _mapRender;
        private readonly IOptionsMonitor<MapSettings> _mapOptionsMontior;
        public TileController(IMapService mapService,
            IMapRender mapRender,
            IOptionsMonitor<MapSettings> mapOptionsMontior)
        {
            _mapService = mapService;
            _mapRender = mapRender;
            _mapOptionsMontior = mapOptionsMontior;
        }

        [HttpGet("1.0.0/map-{mapid}/{z}/{x}/{y}.{formatExtension}")]
        public async Task<IActionResult> GetMapTileAsync(string mapid, int x, int y, int z, string formatExtension)
        {
           
            if (String.IsNullOrEmpty(mapid))
            {
                return BadRequest();
            }

            try
            {
                //var imgPath = Path.Combine(mapOptionsMontior.Value.MapTilesFolder,$"{mapid}/{version}/{z}/{x}/{y}.png")

                var map = await _mapService.GetOrCreateMap(mapid);
                // TODO: check formatExtension == tileset.Configuration.Format

                //kiểm tra tile này đã vẽ chửa
                //Check file exists trong thư mục quy định
                // vẽ rồi nhưng có thể styles đã update, thì style update thì tăng version của map lên
                var ti = new TileInfo { Index = new TileIndex(x, y, z.ToString()) };

                var resolutions = _schema.Resolutions;
                var scale = resolutions.First().Value.ScaleDenominator;
                var bbExtent = TileTransform.TileToWorld(new TileRange(ti.Index.Col, ti.Index.Row), ti.Index.Level, _schema);
                var titleRange = TileTransform.WorldToTile(bbExtent, ti.Index.Level, _schema);
                // MinX, MinY, MaxX, MaxY
                var width = _schema.GetTileWidth(ti.Index.Level);
                var height = _schema.GetTileHeight(ti.Index.Level);


                //Phải clone map để không bị ảnh hưởng các lần render khác
                using (var safeMap = map.Clone()) 
                {
                    var image = _mapRender.RenderImage(safeMap, new MapRenderOptions()
                    {
                        PixelWidth = width,
                        PixelHeight = height,
                        MinX = bbExtent.MinX,
                        MinY = bbExtent.MinY,
                        MaxX = bbExtent.MaxX,
                        MaxY = bbExtent.MaxY,
                    });

                    //save file path
                    
                    //image.Save(imgPath, ImageFormat.Png);

                    byte[] buffer = ImageHelper.ImageToByteArray(image, ImageFormat.Png);
                    //this.Response.Headers.Add("Cache-Control", "no-store,no-cache");
                    return File(buffer, "image/png");
                }
            }
            catch (Exception ex)
            {
                return NotFound($"Specified map '{mapid}' not exists/has error on server. {ex.Message}");
            }
        }


        //for test only
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
