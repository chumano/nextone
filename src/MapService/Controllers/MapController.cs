using MapService.Domain;
using MapService.Domain.Repositories;
using MapService.DTOs.Map;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NextOne.Shared.Common;
using System;
using System.Collections.Generic;
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
        public MapController(ILogger<MapController> logger,
            IdGenerator idGenerator,
            IMapRepository mapRepository)
        {
            _logger = logger;
            _idGenerator = idGenerator;
            _mapRepository = mapRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetMaps()
        {
            var datasources = await _mapRepository.Maps.ToListAsync();
            return Ok(datasources);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var map = await _mapRepository.Get(id);
            if (map == null)
            {
                throw new Exception($"Map {id} is not found");
            }

            return Ok(map);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> CreateMap([FromBody] CreateMapDTO createMapDTO)
        {
            var newId = _idGenerator.GenerateNew();
            var map = new MapInfo()
            {
                Id = newId,
                Name = createMapDTO.Name,
                Note = createMapDTO.Note,
                Layers = new List<MapLayer>()
            };

            _mapRepository.Add(map);


            await _mapRepository.SaveChangesAsync();
            //TODO: send DomainEvent MapCreated

            return Ok(map);
        }

        [HttpPost("Update/{id}")]
        public async Task<IActionResult> UpdateMap(string id, [FromBody] UpdateMapDTO updateMapDTO)
        {
            var map = await _mapRepository.Get(id);
            if (map == null)
            {
                throw new Exception($"Map {id} is not found");
            }

            map.Name = updateMapDTO.Name;
            map.Note = updateMapDTO.Note;

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
                    MinZoom = l.MinZoom,
                    MaxZoom = l.MaxZoom,
                    PaintProperties = l.PaintProperties,
                    Note = l.Note
                });
            }
            map.Layers = layers;

            _mapRepository.Update(map);
            await _mapRepository.SaveChangesAsync();


            map = await _mapRepository.Get(id);

            //generate tiles
            //TODO: send DomainEvent MapUpdated
            return Ok(map);
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

            //TODO: delete tiles
            //TODO: send DomainEvent MapDeleted
            return Ok(map);
        }
    }
}
