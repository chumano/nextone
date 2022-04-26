using GeoAPI;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using NetTopologySuite;
using ProjNet.CoordinateSystems;
using ProjNet.CoordinateSystems.Transformations;
using SharpMap;
using SharpMap.Layers;
using SharpMap.Styles;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static SharpMap.Web.Wms.Capabilities;

namespace MapService
{
    //https://docs.microsoft.com/en-us/aspnet/core/migration/http-modules?view=aspnetcore-2.1
    public class WMSMiddleware
    {
        // Must have constructor with this signature, otherwise exception at run time
        internal static Map m_Map;
        internal static WmsServiceDescription m_Capabilities;

        /*
         * https://localhost:44395/wms?service=WMS&version=1.3.0&request=GetMap&layers=states&styles=&bbox=24.956376399801876,-124.73276978240644,49.37173014378616,-66.96927103600244&width=1200&height=800&crs=EPSG:4326&format=image/png&TRANSPARENT=true

            https://localhost:44395/wms?request=getCapabilities

            bbox miny,minx,maxy,maxx
            minx="-124.73276978240644" miny="24.956376399801876" maxx="-66.96927103600244" maxy="49.37173014378616" CRS="EPSG:4326"
        */
        public WMSMiddleware(RequestDelegate next)
        {
            // This is an HTTP Handler, so no need to store next
        }

        public async Task Invoke(HttpContext context)
        {
            if (m_Map == null)
            {
                m_Map = GetMap(context);
                m_Capabilities = GetDescription(context.Request.GetDisplayUrl());
            }
            //Clone the map-instance since the parse-query-string request will modify sice etc.
            using (var safeMap = m_Map.Clone())
            {
                await Wms.WmsServer.ParseQueryString(safeMap, m_Capabilities, context);
            }
        }

        protected WmsServiceDescription GetDescription(string url)
        {
            WmsServiceDescription description = new WmsServiceDescription("CHUNO Map Server", url);
            description.MaxWidth = 4000;
            description.MaxHeight = 3000;
            description.Abstract = "CHUNO Map Server";
            description.Keywords = new[] { "chumano", "map" };
            description.ContactInformation.PersonPrimary.Person = "HOÀNG XUÂN LỘC";
            description.ContactInformation.PersonPrimary.Organisation = "CCE";
            description.ContactInformation.Address.AddressType = "postal";
            description.ContactInformation.Address.Country = "VIETNAM";
            description.ContactInformation.VoiceTelephone = "0984 275 206";
            return description;
        }

        protected Map GetMap(HttpContext context)
        {
            

            NetTopologySuiteBootstrapper.Bootstrap();
            //request.RequestContext.HttpContext.Server.MapPath();
            var map = new SharpMap.Map();
            map.BackColor = System.Drawing.Color.Transparent;

            //Load vector layer
            VectorLayer lay = new VectorLayer("states");
            string ds = "Data/states.shp";
            if (!Path.IsPathRooted(ds))
                ds = ds.Trim();// Server.MapPath(ds);

            lay.DataSource = new SharpMap.Data.Providers.ShapeFile(ds,true,true)
            {
                Encoding = System.Text.Encoding.UTF8
            };
            lay.Style = new VectorStyle()
            {

            };

            lay.SRID = 4326;
            lay.TargetSRID = 3857;
            map.SRID = 3857;
            map.Layers.Add(lay);

            return map;
        }
    }

    public static class WMSExtensions
    {
        public static IApplicationBuilder UseWMSHandler(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<WMSMiddleware>();
        }
    }
}
