using BruTile;
using BruTile.Predefined;
using MapService.Domain.Services;
using MapService.Infrastructure.AppSettings;
using MapService.MapSources;
using MapService.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MapService.Controllers
{
    [Route("tms")]
    public class TileController : Controller
    {
        private readonly GlobalSphericalMercator _schema = MapUtils.DeaultMapSchema;
        private readonly IHostEnvironment _environment;
        private readonly IMapService _mapService;
        private readonly IMapRender _mapRender;
        private readonly IOptionsMonitor<MapSettings> _mapOptionsMontior;
        public TileController(
            IHostEnvironment hostEnvironment,
            IMapService mapService,
            IMapRender mapRender,
            IOptionsMonitor<MapSettings> mapOptionsMontior)
        {
            _environment = hostEnvironment;
            _mapService = mapService;
            _mapRender = mapRender;
            _mapOptionsMontior = mapOptionsMontior;
        }

        [HttpGet("{version}/map-{mapid}/{z}/{x}/{y}.{formatExtension}")]
        public async Task<IActionResult> GetMapTileVersionAsync(int version, string mapid, int x, int y, int z, string formatExtension)
        {
            if (String.IsNullOrEmpty(mapid))
            {
                return BadRequest();
            }

            if (formatExtension.ToLower() != "png")
            {
                throw new Exception($"Not support format {formatExtension}");
            }

            //TODO: check map version
            try
            {
                var imgPath = Path.Combine(_mapOptionsMontior.CurrentValue.MapTilesFolder, $"{mapid}/{version}/{z}/{x}/{y}.png");

                if (System.IO.File.Exists(imgPath))
                {
                    var physicFile = Path.Combine(_environment.ContentRootPath, imgPath);
                    return PhysicalFile(physicFile, "image/png");
                }

                var image = await RenderMap(mapid,x,y,z, version);

                Directory.GetParent(imgPath).Create();
                image.Save(imgPath, ImageFormat.Png);

                byte[] buffer = ImageHelper.ImageToByteArray(image, ImageFormat.Png);
                return File(buffer, "image/png");
            }
            catch (Exception ex)
            {
                return NotFound($"Specified map '{mapid}' not exists/has error on server. {ex.Message}");
            }
        }

        

        //Render on demon
        [HttpGet("map-{mapid}/{z}/{x}/{y}.{formatExtension}")]
        public async Task<IActionResult> GetMapTileAsync(string mapid, int x, int y, int z, string formatExtension)
        {
            if (String.IsNullOrEmpty(mapid))
            {
                return BadRequest();
            }

            if (formatExtension.ToLower() != "png")
            {
                throw new Exception($"Not support format {formatExtension}");
            }

            try
            {
                var image = await RenderMap(mapid, x, y, z);

                byte[] buffer = ImageHelper.ImageToByteArray(image, ImageFormat.Png);
                //this.Response.Headers.Add("Cache-Control", "no-store,no-cache");
                return File(buffer, "image/png");
                
            }
            catch (Exception ex)
            {
                return NotFound($"Specified map '{mapid}' not exists/has error on server. {ex.Message}");
            }
        }

        private async Task<Image> RenderMap(string mapid, int x, int y, int z, int? version = null)
        {
            //TODO: return mapContainer
            var map = await _mapService.GetOrCreateMap(mapid);
            if (version != null)
            {
                var mapVersion = 1;
                if(mapVersion != version)
                {
                    throw new Exception($"Version {version} is invalid. Current Map Version is {mapVersion}");
                }
            }

            var ti = new TileInfo { Index = new TileIndex(x, y, z.ToString()) };
            var bbExtent = TileTransform.TileToWorld(new TileRange(ti.Index.Col, ti.Index.Row), ti.Index.Level, _schema);

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

                return image;
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
