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
        Task<SharpMap.Map> GetOrCreateMap(string mapId);
    }

    public class MapService: IMapService
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

        public async Task<SharpMap.Map> GetOrCreateMap(string mapId)
        {
            await semaphoreSlim.WaitAsync();
            try
            {
                var map = await _cacheStore.Get<SharpMap.Map>(mapId);
                if (map == null)
                {
                    var mapInfo = await _mapRespository.Get(mapId);
                   
                    map = _mapFactory.GenerateMap(mapInfo);
                    await _cacheStore.Set(mapId, map);

                }

                return map;
            }
            finally
            {
                semaphoreSlim.Release();
            }
            
        }

    }
}
