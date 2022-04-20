using BruTile;
using BruTile.Predefined;
using BruTile.Wmsc;
using MapService.Utils;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Threading.Tasks;

namespace MapService.MapSources
{
    public class WMSTileSource : ITileSource
    {
        private readonly TileSetConfiguration configuration;
        private readonly string contentType;

        public string ContentType => throw new NotImplementedException();
        WmscRequest wmscRequest;

        public WMSTileSource(TileSetConfiguration configuration)
        {
            this.configuration = configuration;
            this.contentType = MapUtils.GetContentType(this.configuration.Format);

            var schema = new GlobalSphericalMercator("image/png", YAxis.TMS, 0, 19);
            var url = this.configuration.Source.Replace(MapUtils.WMSTilesScheme, ""); //"https://localhost:5050/wms?"
            var hostname = Dns.GetHostName(); // get container id
            var ip = Dns.GetHostEntry(hostname).AddressList.FirstOrDefault(x => x.AddressFamily == AddressFamily.InterNetwork);
            url = url.Replace("localhost", ip.ToString());
            wmscRequest = new WmscRequest(new Uri(url), 
                schema, 
                new[] { "states" }, new[] { "" }, 
                new Dictionary<string, string>()
                {
                    {"TRANSPARENT","true" }
                    //{"CRS","EPSG:3857" }
                }, 
                "1.3.0");
        }

        TileSetConfiguration ITileSource.Configuration => this.configuration;
        string ITileSource.ContentType => this.contentType;

        public Task<byte[]> GetTileAsync(int x, int y, int z)
        {
            var ti = new TileInfo { Index = new TileIndex(x, y, z.ToString()) };
            var uri = wmscRequest.GetUri(ti);
            var httpWebRequest = (HttpWebRequest)WebRequest.Create(uri);
            return FetchImageAsync(httpWebRequest);
        }

        private async Task<byte[]> FetchImageAsync(HttpWebRequest httpWebRequest)
        {
            var response = await httpWebRequest.GetResponseAsync();
            using (MemoryStream ms = new MemoryStream())
            {
                response.GetResponseStream().CopyTo(ms);
                byte[] data = ms.ToArray();
                return data;
            }
        }
    }
}
