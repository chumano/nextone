using GeoAPI.CoordinateSystems.Transformations;
using GeoAPI.Geometries;
using Microsoft.AspNetCore.Http;
using SharpMap;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MapService
{
    //https://stackoverflow.com/questions/50070512/sharpmap-wmts-tms-server-implementation
    public class WMTS 
    {
        /// <summary>
        /// Defines the projection
        /// </summary>
        private readonly ICoordinateTransformation projection;

        /// <summary>
        /// The ProcessRequest
        /// wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=layer_id&STYLE=default&TILEMATRIXSET=matrix_id&TILEMATRIX=3&TILEROW=2&TILECOL=0&FORMAT=image%2Fjpeg
        /// </summary>
        /// <param name="context">The <see cref="HttpContext"/></param>
        public void ProcessRequest(HttpContext context)
        {
            string layer = context.Request.Query["LAYER"];
            int tilematrix = int.Parse(context.Request.Query["TILEMATRIX"]);
            int tilerow = int.Parse(context.Request.Query["TILEROW"]);
            int tilecol = int.Parse(context.Request.Query["TILECOL"]);
            string service = context.Request.Query["SERVICE"];
            string request = context.Request.Query["REQUEST"];
            string version = context.Request.Query["VERSION"];
            string style = context.Request.Query["STYLE"];
            string tilematrixset = context.Request.Query["TILEMATRIXSET"];
            string format = context.Request.Query["FORMAT"];

            if (String.IsNullOrEmpty(layer))
                throw new ArgumentNullException("layer");

            Envelope bbox = GetBoundingBoxInLatLngWithMargin(tilecol, tilerow, tilematrix);

            Map map = Map(layer, bbox);

            map.ZoomToBox(bbox);

            var map_image = map.GetMap();

            using (var memory_stream = new MemoryStream())
            {
                map_image.Save(memory_stream, ImageFormat.Png);

                var wms = memory_stream.ToArray();

                WriteResponseInChunks(wms, context);
            }

        }

        public static ImageCodecInfo GetEncoderInfo(String mimeType)
        {
            foreach (var encoder in ImageCodecInfo.GetImageEncoders())
                if (encoder.MimeType == mimeType)
                    return encoder;
            return null;
        }
        /// <summary>
        /// The GetMap
        /// </summary>
        /// <returns>The <see cref="SharpMap.Map"/></returns>
        protected Map Map(string layer, Envelope bbox)
        {

            return null;// DatabaseUtil.SqlServer(ConnectionString(), Layers().FindAll(lyr => lyr.Table.Equals(layer)), new Size(1, 1), bbox, "id");
        }




        /// <summary>
        /// The GetBoundingBoxInLatLngWithMargin
        /// </summary>
        /// <param name="tileX">The <see cref="int"/></param>
        /// <param name="tileY">The <see cref="int"/></param>
        /// <param name="zoom">The <see cref="int"/></param>
        /// <returns>The <see cref="Envelope"/></returns>
        private Envelope GetBoundingBoxInLatLngWithMargin(int tileX, int tileY, int zoom)
        {
            Point px1 = new Point((tileX * 256), (tileY * 256));
            Point px2 = new Point(((tileX + 1) * 256), ((tileY + 1) * 256));

            //PointF ll1 = TileSystemHelper.PixelXYToLatLong(px1, zoom);
            //PointF ll2 = TileSystemHelper.PixelXYToLatLong(px2, zoom);

            //double[] prj1 = projection.MathTransform.Transform(new double[] { ll1.X, ll1.Y });
            //double[] prj2 = projection.MathTransform.Transform(new double[] { ll2.X, ll2.Y });

            //Envelope bbox = new Envelope();
            //bbox.ExpandToInclude(prj1[0], prj1[1]);
            //bbox.ExpandToInclude(prj2[0], prj2[1]);
            return null;// bbox;
        }

        /// <summary>
        /// The size of the chunks written to response.
        /// </summary>
        private const int ChunkSize = 2 * 8192;

        /// <summary>
        /// Method to write an array of bytes in chunks to a http response
        /// </summary>
        /// <remarks>
        /// The code was adopted from http://support.microsoft.com/kb/812406/en-us
        /// </remarks>
        /// <param name="buffer">The array of bytes</param>
        /// <param name="context">The response</param>
        private static void WriteResponseInChunks(byte[] buffer, HttpContext context)
        {
            try
            {
                bool _continue;

                context.Response.Clear();

                context.Response.ContentType = "image/png";

                using (var ms = new MemoryStream(buffer))
                {
                    var dataToRead = buffer.Length;

                    while (dataToRead > 0)
                    {
                        
                                var tmpBuffer = new byte[ChunkSize];
                                var length = ms.Read(tmpBuffer, 0, tmpBuffer.Length);
                                context.Response.Body.Write(tmpBuffer, 0, length);
                                context.Response.Body.Flush();
                                dataToRead -= length;
                            
                        
                    }
                    _continue = dataToRead > 0;

                }
            }
            catch (Exception ex)
            {
                context.Response.Clear();
                context.Response.ContentType = "text/plain";
                context.Response.WriteAsync(string.Format("Error     : {0}", ex.Message));
                context.Response.WriteAsync(string.Format("Source    : {0}", ex.Message));
                context.Response.WriteAsync(string.Format("StackTrace: {0}", ex.StackTrace));
            }
            finally
            {
                context.Response.StatusCode = StatusCodes.Status200OK;
            }
        }

        /// <summary>
        /// Gets a value indicating whether IsReusable
        /// </summary>
        public bool IsReusable
        {
            get
            {
                return true;
            }
        }
    }
}
