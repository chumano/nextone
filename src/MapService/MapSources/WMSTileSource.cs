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

        WmscRequest wmscRequest;

        public WMSTileSource(TileSetConfiguration configuration)
        {
            this.configuration = configuration;
            this.contentType = MapUtils.GetContentType(this.configuration.Format);

            var schema = new GlobalSphericalMercator("image/png", YAxis.TMS, 0, 19);
            var url = this.configuration.Source.Replace(MapUtils.WMSTilesScheme, ""); //"https://localhost:5050/wms?"

            //var hostname = Dns.GetHostName(); // get container id
            //var ip = Dns.GetHostEntry(hostname).AddressList.FirstOrDefault(x => x.AddressFamily == AddressFamily.InterNetwork);
            //url = url.Replace("localhost", ip.ToString());

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

        //public Uri GetUri(TileInfo info)
        //{
        //    var url = new StringBuilder(_baseUrl.AbsoluteUri);
        //    url.Append(string.IsNullOrWhiteSpace(_baseUrl.Query) ? "?SERVICE=WMS" : "&SERVICE=WMS");
        //    if (!string.IsNullOrEmpty(_version)) url.AppendFormat("&VERSION={0}", _version);
        //    url.Append("&REQUEST=GetMap");
        //    url.AppendFormat("&BBOX={0}", TileTransform.TileToWorld(new TileRange(info.Index.Col, info.Index.Row), info.Index.Level, _schema));
        //    url.AppendFormat("&FORMAT={0}", _schema.Format);
        //    url.AppendFormat("&WIDTH={0}", _schema.GetTileWidth(info.Index.Level));
        //    url.AppendFormat("&HEIGHT={0}", _schema.GetTileHeight(info.Index.Level));
        //    var crsFormat = !string.IsNullOrEmpty(_version) && string.CompareOrdinal(_version, "1.3.0") >= 0 ? "&CRS={0}" : "&SRS={0}";
        //    url.AppendFormat(crsFormat, _schema.Srs);
        //    url.AppendFormat("&LAYERS={0}", ToCommaSeparatedValues(_layers));
        //    if (_styles != null && _styles.Count > 0) url.AppendFormat("&STYLES={0}", ToCommaSeparatedValues(_styles));
        //    AppendCustomParameters(url);
        //    return new Uri(url.ToString());
        //}

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
