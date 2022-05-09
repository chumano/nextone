using BruTile;
using BruTile.Predefined;
using GeoAPI;
using MapService.MapSources;
using Microsoft.Extensions.Configuration;
using NetTopologySuite;
using ProjNet.CoordinateSystems;
using ProjNet.CoordinateSystems.Transformations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MapService.Utils
{
    public static class MapUtils
    {
        public static readonly GlobalSphericalMercator DeaultMapSchema = new GlobalSphericalMercator("image/png", YAxis.TMS, 0, 19);
        public static readonly string ImagePng = "image/png";
        public static readonly string ImageJpeg = "image/jpeg";
        public static readonly string TextXml = "text/xml";

        public static readonly string LocalFileScheme = "file:///";
        public static readonly string MBTilesScheme = "mbtiles:///";
        public static readonly string WMSTilesScheme = "wms:///";

        public static readonly string TileMapServiceVersion = "1.0.0";

        public static readonly string EPSG3857 = "EPSG:3857";

        public static IList<TileSetConfiguration> GetTileSetConfigurations(this IConfiguration configuration)
        {
            return configuration
                .GetSection("tilesets")
                .Get<IList<TileSetConfiguration>>();
        }

        public static string GetContentType(string tileFormat)
        {
            var mediaType = String.Empty;
            switch (tileFormat)
            {
                case "png": { mediaType = ImagePng; break; }
                case "jpg": { mediaType = ImageJpeg; break; }
                default: throw new ArgumentException("tileFormat");
            }

            return mediaType;
        }

        public static bool IsMBTilesScheme(string source)
        {
            return source.StartsWith(MBTilesScheme, StringComparison.Ordinal);
        }

        public static bool IsLocalFileScheme(string source)
        {
            return source.StartsWith(LocalFileScheme, StringComparison.Ordinal);
        }

        public static bool IsWMSTilesScheme(string source)
        {
            return source.StartsWith(WMSTilesScheme, StringComparison.Ordinal);
        }

        // https://alastaira.wordpress.com/2011/07/06/converting-tms-tile-coordinates-to-googlebingosm-tile-coordinates/

        /// <summary>
        /// Convert Y tile coordinate of TMS standard (flip)
        /// </summary>
        /// <param name="y"></param>
        /// <param name="zoom">Zoom level</param>
        /// <returns></returns>
        public static int FromTmsY(int tmsY, int zoom)
        {
            return (1 << zoom) - tmsY - 1;
        }


        public static void InitSharpMap()
        {
            NetTopologySuiteBootstrapper.Bootstrap();

            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

            var gss = new NtsGeometryServices();
            var css = new SharpMap.CoordinateSystems.CoordinateSystemServices(
                new CoordinateSystemFactory(),
                new CoordinateTransformationFactory(),
                SharpMap.Converters.WellKnownText.SpatialReference.GetAllReferenceSystems());

            var cs3405 = css.GetCoordinateSystem(3405);
            var cs4326 = css.GetCoordinateSystem(4326);

            GeoAPI.GeometryServiceProvider.Instance = gss;
            SharpMap.Session.Instance
                .SetGeometryServices(gss)
                .SetCoordinateSystemServices(css)
                .SetCoordinateSystemRepository(css);
        }
    }
}
