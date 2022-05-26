using MapService.Domain.Repositories;
using MapService.Utils;
using NextOne.Infrastructure.Core.Caching;
using ProjNet.CoordinateSystems.Transformations;
using SharpMap;
using SharpMap.Data.Providers;
using SharpMap.Layers;
using SharpMap.Styles;
using System.Drawing;
using System.Threading;
using System.Threading.Tasks;

namespace MapService.Domain.Services
{
    public interface IMapService
    {
        Task<MapContainer> GetOrCreateMap(string mapId);
    }

    public class MapService : IMapService
    {
        private static SemaphoreSlim semaphoreSlim = new SemaphoreSlim(1, 1);
        private readonly IMapRepository _mapRespository;
        private readonly ICacheStore _cacheStore;
        private readonly ISharpMapFactory _mapFactory;

        public MapService(IMapRepository mapRespository,
            ICacheStore cacheStore,
            ISharpMapFactory sharpMapFactory)
        {
            _mapRespository = mapRespository;
            _cacheStore = cacheStore;
            _mapFactory = sharpMapFactory;
        }

        public async Task<MapContainer> GetOrCreateMap(string mapId)
        {
            await semaphoreSlim.WaitAsync();
            try
            {
                var mapContainer = await _cacheStore.Get<MapContainer>(mapId);
                if (mapContainer != null)
                {
                    return mapContainer;
                }

                var mapInfo = await _mapRespository.Get(mapId);
                if(mapInfo ==null)
                {
                    throw new System.Exception($"Map {mapId} is not found");
                }
                var shaprMap = _mapFactory.GenerateMap(mapInfo);

                mapContainer = new MapContainer()
                {
                    Id = mapId,
                    Name = mapInfo.Name,
                    OffsetX = mapInfo.OffsetX,
                    OffsetY = mapInfo.OffsetY,
                    Version = mapInfo.Version,
                    CreatedDate = System.DateTime.Now,
                    LastUsed = System.DateTime.Now,
                    IsPublished = mapInfo.IsPublished,
                    Map = shaprMap
                };

                await _cacheStore.Set(mapId, mapContainer, System.TimeSpan.FromMinutes(5));

                return mapContainer;
            }
            finally
            {
                semaphoreSlim.Release();
            }

        }

    }
}
