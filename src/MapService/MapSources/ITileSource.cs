using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MapService.MapSources
{
    public interface ITileSource
    {
        Task<byte[]> GetTileAsync(int x, int y, int z);

        TileSetConfiguration Configuration { get; }

        string ContentType { get; }
    }
}
