using MapService.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MapService.MapSources
{
    public class TileSources
    {
        static TileSources()
        {
            var Configurations = new List<TileSetConfiguration>()
            {
                new TileSetConfiguration()
                {
                    Format ="png",
                    Name = "world-countries",
                    Source = "mbtiles:///D:\\workspace\\ucom\\codes\\ucom\\servers\\mapserver\\Data\\world_countries.mbtiles",
                    Tms = true,
                    UseCoordinatesCache = false
                },
                new TileSetConfiguration()
                {
                    Format ="png",
                    Name = "gg_vn_map",
                    Source = "file:///D:\\GoogleMap\\Map\\{z}\\{x}\\{y}.png",
                    Tms = true,
                    UseCoordinatesCache = false
                },
                new TileSetConfiguration()
                {
                    Format ="png",
                    Name = "gg_vn_satelite",
                    Source = "file:///D:\\GoogleMap\\Satelite\\{z}\\{x}\\{y}.png",
                    Tms = true,
                    UseCoordinatesCache = false
                },
                new TileSetConfiguration()
                {
                    Format ="png",
                    Name = "us_states",
                    Source = "wms:///http://localhost:5050/wms?",
                    Tms = true,
                    UseCoordinatesCache = false
                }
            };
            Sources = Configurations.ToDictionary(c => c.Name, c => CreateTileSource(c));
        }

        private static Dictionary<string, ITileSource> Sources;

        public static ITileSource GetTileSource(string name)
        {
            if (Sources.ContainsKey(name))
            {
                return Sources[name];
            }
            throw new KeyNotFoundException($"Not found source name {name}");
        }

        private static ITileSource CreateTileSource(TileSetConfiguration configuration)
        {
            if (MapUtils.IsLocalFileScheme(configuration.Source))
            {
                return new LocalFileTileSource(configuration);
            }
            else if (MapUtils.IsMBTilesScheme(configuration.Source))
            {
                return new MBTilesTileSource(configuration);
            }else if (MapUtils.IsWMSTilesScheme(configuration.Source))
            {
                return new WMSTileSource(configuration);
            }
            else
            {
                return null;
            }
        }

    }
}
