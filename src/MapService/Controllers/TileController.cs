using BruTile;
using BruTile.Predefined;
using GeoAPI.Geometries;
using MapService.Domain.Services;
using MapService.Infrastructure.AppSettings;
using MapService.MapSources;
using MapService.Utils;
using Microsoft.AspNetCore.Cors;
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
        private static Image EmptyTile;
        private static Object _imageLock = new Object();

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

        //[DisableCors]
        [HttpGet("{version}/map-{mapid}/{z}/{x}/{y}.{formatExtension}")]
        public async Task<IActionResult> GetMapTileVersionAsync(string version, string mapid, int x, int y, int z, string formatExtension)
        {
            if (String.IsNullOrEmpty(mapid))
            {
                return BadRequest();
            }

            if (formatExtension.ToLower() != "png")
            {
                throw new Exception($"Not support format {formatExtension}");
            }

            int? versionNum = null; 
            if(version == "latest")
            {
                versionNum = -1;
            }
            else
            {
                if(!int.TryParse(version, out var parsedVersion))
                {
                    throw new Exception($"Version {version} is invalid");
                }

                versionNum = parsedVersion;
            }

            try
            {

                var imgPath = GetTileImagePath(mapid, x, y, z, versionNum.Value);
                if (System.IO.File.Exists(imgPath))
                {
                    var physicFile = Path.Combine(_environment.ContentRootPath, imgPath);
                    return PhysicalFile(physicFile, "image/png");
                }

                var image = await RenderMap(mapid,x,y,z,true, versionNum);
                if (image == null)
                {
                    image = GetEmptyImage();
                }
               
                byte[] buffer = ImageHelper.ImageToByteArray(image, ImageFormat.Png);
                return File(buffer, "image/png");
            }
            catch (Exception ex)
            {
                return NotFound($"Specified map '{mapid}' not exists/has error on server. {ex.Message}");
            }
        }

        //Render on demand
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
                var image = await RenderMap(mapid, x, y, z, false, -1); //latest
                if(image == null) {
                    image = GetEmptyImage();
                }
                byte[] buffer = ImageHelper.ImageToByteArray(image, ImageFormat.Png);
                this.Response.Headers.Add("Cache-Control", "no-store,no-cache");
                return File(buffer, "image/png");
                
            }
            catch (Exception ex)
            {
                return NotFound($"Specified map '{mapid}' not exists/has error on server. {ex.Message}");
            }
        }

        private async Task<Image> RenderMap(string mapid, int x, int y, int z, bool isRequestSaveTile = false, int? version = null)
        {
            //TODO: chỗ này lúc request cho latest thì chỉ cần cache thông tin đơn gian thôi
            // vì chỉ cần mapVersion, không cần SharpMap
            var mapContainer = await _mapService.GetOrCreateMap(mapid);
            if (version != null)
            {
                var mapVersion = mapContainer.Version;
                if(version != -1 //latest
                    && mapVersion != version)
                {
                    throw new Exception($"Version {version} is invalid. Current Map Version is {mapVersion}");
                }

                if(version == -1)//latest
                {
                    var imgPath = GetTileImagePath(mapid, x, y, z, mapVersion);
                    if (System.IO.File.Exists(imgPath))
                    {
                        return Image.FromFile(imgPath);
                    }
                }
            }

            var ti = new TileInfo { Index = new TileIndex(x, y, z.ToString()) };
            var bbExtent = TileTransform.TileToWorld(new TileRange(ti.Index.Col, ti.Index.Row), ti.Index.Level, _schema);
            // MinX, MinY, MaxX, MaxY
            var width = _schema.GetTileWidth(ti.Index.Level);
            var height = _schema.GetTileHeight(ti.Index.Level);

            var renderOptions = new MapRenderOptions()
            {
                PixelWidth = width,
                PixelHeight = height,
                MinX = bbExtent.MinX + _mapOptionsMontior.CurrentValue.MapOffsetX,
                MinY = bbExtent.MinY + _mapOptionsMontior.CurrentValue.MapOffsetY,
                MaxX = bbExtent.MaxX + _mapOptionsMontior.CurrentValue.MapOffsetX,
                MaxY = bbExtent.MaxY + _mapOptionsMontior.CurrentValue.MapOffsetY,
            };
            
            //check intersects
            var requestExtent = renderOptions.Envelope;
            var mapExtent = mapContainer.Map.GetExtents();
            if (!mapExtent.Intersects(requestExtent))
            {
                return null;
            }

            //Phải clone map để không bị ảnh hưởng các lần render khác
            using (var safeMap = mapContainer.Map.Clone())
            {
                var image = _mapRender.RenderImage(safeMap, renderOptions);

                if(isRequestSaveTile && mapContainer.IsPublished)
                {
                    var imgPath = GetTileImagePath(mapid, x, y, z, mapContainer.Version);
                    Directory.GetParent(imgPath).Create();
                    image.Save(imgPath, ImageFormat.Png);
                }

                return image;
            }
        }

        private Image GetEmptyImage()
        {
            lock (_imageLock)
            {
                if (EmptyTile == null)
                {
                    EmptyTile = Image.FromFile("Data/tile_empty_256_256.png");
                }

                return (Image)EmptyTile.Clone();
            }
        }

        private string GetTileImagePath(string mapid, int x, int y, int z, int version)
        {
            var imgPath = Path.Combine(_mapOptionsMontior.CurrentValue.MapTilesFolder, $"{mapid}/{version}/{z}/{x}/{y}.png");
            return imgPath;
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
