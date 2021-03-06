using MapService.Utils;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MapService.MapSources
{
    public class LocalFileTileSource : ITileSource
    {
        private readonly TileSetConfiguration configuration;

        private readonly string contentType;

        public LocalFileTileSource(TileSetConfiguration configuration)
        {
            this.configuration = configuration;
            this.contentType = MapUtils.GetContentType(this.configuration.Format);
        }

        async Task<byte[]> ITileSource.GetTileAsync(int x, int y, int z)
        {
            if (!this.configuration.Tms)
            {
                y = MapUtils.FromTmsY(y, z);
            }

            var path = GetLocalFilePath(this.configuration.Source, x, y, z);
            var fileInfo = new FileInfo(path);
            if (fileInfo.Exists)
            {
                var buffer = new byte[fileInfo.Length];
                using (var fileStream = fileInfo.OpenRead())
                {
                    await fileStream.ReadAsync(buffer, 0, buffer.Length);
                    return buffer;
                }
            }
            else
            {
                return null;
            }
        }

        private static string GetLocalFilePath(string source, int x, int y, int z)
        {
            var uriString = String.Format(
                        CultureInfo.InvariantCulture,
                        source.Replace("{x}", "{0}").Replace("{y}", "{1}").Replace("{z}", "{2}"),
                        x,
                        y,
                        z);
            var uri = new Uri(uriString);

            return uri.LocalPath;
        }

        TileSetConfiguration ITileSource.Configuration => this.configuration;

        string ITileSource.ContentType => this.contentType;
    }
}
