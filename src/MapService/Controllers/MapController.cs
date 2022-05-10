using GeoAPI.CoordinateSystems.Transformations;
using MapService.Domain;
using MapService.Domain.Repositories;
using MapService.Domain.Services;
using MapService.DTOs;
using MapService.DTOs.Map;
using MapService.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NextOne.Infrastructure.Core.Caching;
using NextOne.Shared.Common;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace MapService.Controllers
{
    [Route("maps")]
    [ApiController]
    public class MapController : ControllerBase
    {
        private readonly ILogger<MapController> _logger;
        private readonly IMapRepository _mapRepository;
        private readonly IdGenerator _idGenerator;
        private readonly IMapRender _mapRender;
        private readonly ICacheStore _cacheStore;
        private readonly ISharpMapFactory _mapFactory;

        public MapController(ILogger<MapController> logger,
            IdGenerator idGenerator,
            IMapRepository mapRepository,
            IMapRender mapRender,
            ISharpMapFactory mapFactory,
            ICacheStore cacheStore)
        {
            _logger = logger;
            _idGenerator = idGenerator;
            _mapRepository = mapRepository;
            _mapRender = mapRender;
            _mapFactory = mapFactory;
            _cacheStore = cacheStore;
        }

        [HttpGet]
        public async Task<IActionResult> GetMaps()
        {
            Expression<Func<MapInfo, MapDTO>> expression = o => new MapDTO();

            var objs = await _mapRepository.Maps
                .OrderByDescending(o => o.CreatedDate)
                .ToListAsync();
            return Ok(objs.Select(o=> MapDTO.From(o)));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var map = await _mapRepository.Get(id);
            if (map == null)
            {
                throw new Exception($"Map {id} is not found");
            }

            var mapDto = MapDTO.From(map);

            return Ok(mapDto);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> CreateMap([FromBody] CreateMapDTO createMapDTO)
        {

            var existNameObj = await _mapRepository.Maps.Where(o => o.Name == createMapDTO.Name).FirstOrDefaultAsync();

            if (existNameObj != null)
            {
                throw new Exception($"Map Name is in use");
            }

            var newId = _idGenerator.GenerateNew();
            var map = new MapInfo(newId, createMapDTO.Name, createMapDTO.Note);

            _mapRepository.Add(map);

            await _mapRepository.SaveChangesAsync();
            //TODO: send DomainEvent MapCreated
            var mapDto = MapDTO.From(map);
            return Ok(mapDto);
        }

        [HttpPost("UpdateName/{id}")]
        public async Task<IActionResult> UpdateMapName(string id, [FromBody] UpdateMapNameDTO updateMapDTO)
        {
            var map = await _mapRepository.Get(id);
            if (map == null)
            {
                throw new Exception($"Map {id} is not found");
            }

            map.Name = updateMapDTO.Name;
            map.Note = updateMapDTO.Note;

            _mapRepository.Update(map);
            await _mapRepository.SaveChangesAsync();

            var mapDto = MapDTO.From(map);
            return Ok(mapDto);
        }

        [HttpPost("Update/{id}")]
        public async Task<IActionResult> UpdateMap(string id, [FromBody] UpdateMapDTO updateMapDTO)
        {
            var map = await _mapRepository.Get(id);
            if (map == null)
            {
                throw new Exception($"Map {id} is not found");
            }


            var layers = new List<MapLayer>();
            var index = 0;
            foreach(var l in updateMapDTO.Layers)
            {
                layers.Add(new MapLayer()
                {
                    LayerIndex = index++,
                    LayerName = l.LayerName,
                    LayerGroup = l.LayerGroup,
                    DataSourceId = l.DataSourceId,
                    Active = l.Active,
                    MinZoom = l.MinZoom,
                    MaxZoom = l.MaxZoom,
                    PaintProperties = l.PaintProperties,
                    Note = l.Note
                });
            }
            map.Layers = layers;
            map.UpdatedDate = DateTime.Now;
            map.Version = map.Version + 1;

            _mapRepository.Update(map);
            await _mapRepository.SaveChangesAsync();

            //generate map image
            try
            {
                map = await _mapRepository.Get(id);
                using (var rMap = _mapFactory.GenerateMap(map))
                {
                    var extents = rMap.GetExtents();
                    var img = _mapRender.RenderImage(rMap, new MapRenderOptions()
                    {
                        PixelWidth = 500,
                        BackgroundColor = Color.White
                    });
                    var imgBytes = ImageHelper.ImageToByteArray(img);
                    map.ImageData = imgBytes;

                    //transform to latlng 4326
                    var transformedExtents = _mapFactory.TransformToLatLng(extents);
                    map.SetBoudingBox(new MapBoundingBox(
                            transformedExtents.MinX, transformedExtents.MinY,
                            transformedExtents.MaxX, transformedExtents.MaxY
                        ));
                }
                  
                _mapRepository.Update(map);

                await _mapRepository.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, $"MapController-RenderImage {ex.Message}");
            }

            //clear Map Cache
            await _cacheStore.Remove<SharpMap.Map>(map.Id, out var _);

            //TODO: send DomainEvent MapUpdated
            var mapDto = MapDTO.From(map);
            return Ok(mapDto);
        }

        [HttpPost("Render/{id}")]
        public async Task<IActionResult> ReaderMap(string id, [FromBody] RenderMapDTO renderMapDTO)
        {
            var map = await _mapRepository.Get(id);
            if (map == null)
            {
                throw new Exception($"Map {id} is not found");
            }

            //TODO: render map
            return Ok(map);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var map = await _mapRepository.Get(id);
            if (map == null)
            {
                throw new Exception($"Map {id} is not found");
            }
            _mapRepository.Delete(map);

            await _mapRepository.SaveChangesAsync();

            //clear Map Cache
            await _cacheStore.Remove<SharpMap.Map>(map.Id, out var _);

            //TODO: delete tiles
            //TODO: send DomainEvent MapDeleted
            var mapDto = MapDTO.From(map);
            return Ok(mapDto);
        }
    }
}
