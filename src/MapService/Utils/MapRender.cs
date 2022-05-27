using BruTile.Predefined;
using GeoAPI.Geometries;
using MapService.Domain;
using MapService.Domain.Services;
using ProjNet.CoordinateSystems.Transformations;
using SharpMap;
using SharpMap.Data.Providers;
using SharpMap.Layers;
using SharpMap.Styles;
using System;
using System.Drawing;
using System.IO;

namespace MapService.Utils
{
    public class MapRenderOptions
    {
        public int PixelWidth { get; set; }
        public int? PixelHeight { get; set; }
        public int TargetSRID { get; set; }

        public double? MinX { get; set; }
        public double? MinY { get; set; }
        public double? MaxX { get; set; }
        public double? MaxY { get; set; }

        public Color BackgroundColor { get; set; }

        public bool IsCalculateZoom { get; set; }
        public MapRenderOptions()
        {
            PixelWidth = 512;
            PixelHeight = null;
            TargetSRID = 3857;
            BackgroundColor = Color.Transparent;
            IsCalculateZoom = true;
        }

        public Envelope Envelope
        {
            get
            {
                if (!MinX.HasValue
                    || !MinY.HasValue
                    || !MaxX.HasValue
                    || !MaxY.HasValue)
                    return null;

                var flipXY = TargetSRID == 4326;

                return flipXY
                   ? new Envelope(MinY.Value, MaxY.Value, MinX.Value, MaxX.Value)
                   : new Envelope(MinX.Value, MaxX.Value, MinY.Value, MaxY.Value);
            }
        }
    }

    public interface IMapRender
    {
        Image RenderImage(MapInfo mapInfo, MapRenderOptions renderOptions);
        Image RenderImage(DataSource dataSource, MapRenderOptions renderOptions);
        Image RenderImage(ShapeFile dataProvider, MapRenderOptions renderOptions);

        Image RenderImage(Map map, MapRenderOptions renderOptions);
    }
    public class MapRender : IMapRender
    {
        private readonly GlobalSphericalMercator _schema = MapUtils.DeaultMapSchema;
        private readonly ISharpMapFactory _mapFactory;
        public MapRender(ISharpMapFactory mapFactory)
        {
            _mapFactory = mapFactory;
        }

        public Image RenderImage(MapInfo mapInfo, MapRenderOptions renderOptions)
        {
            Map map = _mapFactory.GenerateMap(mapInfo, renderOptions.TargetSRID);
            return RenderImage(map, renderOptions);
        }

        public Image RenderImage(DataSource dataSource, MapRenderOptions renderOptions)
        {
            Image img;
            using (var dataProvider = new ShapeFile(dataSource.SourceFile, true))
            {
                img = RenderImage(dataProvider, renderOptions);
            }

            return img;
        }

        public Image RenderImage(ShapeFile dataProvider, MapRenderOptions renderOptions)
        {
            Map map = _mapFactory.GenerateMap(dataProvider, renderOptions.TargetSRID);
            return RenderImage(map, renderOptions);
        }

        public Image RenderImage(Map map, MapRenderOptions renderOptions)
        {
            var bbox = renderOptions.Envelope;
            if (bbox == null)
            {
                if ((map.Layers == null || map.Layers.Count == 0) &&
                  (map.VariableLayers == null || map.VariableLayers.Count == 0) &&
                  (map.BackgroundLayer == null || map.BackgroundLayer.Count == 0))
                    throw (new InvalidOperationException("No layers to zoom to"));
                bbox = map.GetExtents();
            }

            var width = renderOptions.PixelWidth;
            var height = (int)(width * bbox.Height / bbox.Width);
            if (renderOptions.PixelHeight.HasValue)
            {
                height = renderOptions.PixelHeight.Value;
            }

            renderOptions.PixelHeight = height;

            var renderEnlarger = true;
            if (renderEnlarger)
            {
                return RenderImageEnlarger(map, renderOptions);
            }
            return RenderImageInternal(map, renderOptions);
        }

        private Image RenderImageEnlarger(Map map, MapRenderOptions renderOptions)
        {
            var width = renderOptions.PixelWidth;
            var height = renderOptions.PixelHeight.Value;

            var enlargeRenderOptions = new MapRenderOptions()
            {
                PixelWidth = width * 2,
                PixelHeight = height * 2,
                MinX = renderOptions.MinX - (renderOptions.MaxX - renderOptions.MinX) / 2,
                MinY = renderOptions.MinY - (renderOptions.MaxY - renderOptions.MinY) / 2,
                MaxX = renderOptions.MaxX + (renderOptions.MaxX - renderOptions.MinX) / 2,
                MaxY = renderOptions.MaxY + (renderOptions.MaxY - renderOptions.MinY) / 2,
            };

            var image = RenderImageInternal(map, enlargeRenderOptions);

            //crop 
            var croppedImage = ImageHelper.CropImage(image, new Rectangle(
                    0+ width / 2,
                    0+ height / 2,
                    width,
                    height
                ));
            return croppedImage;
        }
        public Image RenderImageInternal(Map map, MapRenderOptions renderOptions)
        {
            var bbox = renderOptions.Envelope;

            var width = renderOptions.PixelWidth;
            var height = renderOptions.PixelHeight.Value;

            map.BackColor = renderOptions.BackgroundColor; //Color.Transparent; //Color.FromArgb(192, Color.Black)
            map.Size = new Size(width, height);
            map.PixelAspectRatio = (width / (double)height) / (bbox.Width / bbox.Height);
            map.Center = bbox.Centre;
            map.Zoom = bbox.Width;
            map.SRID = renderOptions.TargetSRID;
            if (renderOptions.IsCalculateZoom)
            {
                foreach (var layer in map.Layers)
                {
                    int zoomLvl1 = (int)layer.MinVisible;
                    int zoomLvl2 = (int)layer.MaxVisible;
                    // zoom lvl to Width thì phải ngược lại
                    layer.MinVisible = Math.Floor(ConvertZoomLevel((int)zoomLvl2, renderOptions.PixelWidth));
                    layer.MaxVisible = Math.Ceiling(ConvertZoomLevel((int)zoomLvl1, renderOptions.PixelWidth));
                }
            }


            var img = map.GetMap();
            //var imageName = Path.ChangeExtension(dataSource.SourceFile, ".jpg");
            //img.Save(imageName, System.Drawing.Imaging.ImageFormat.Jpeg);
            return img;
        }


        private double ConvertZoomLevel(int lvl, int pixelWith = 256)
        {
            //https://wiki.openstreetmap.org/wiki/Zoom_levels
            var resolutions = _schema.Resolutions;
            if (lvl <= 0)
            {
                lvl = 1;
            }
            if (lvl > 19)
            {
                lvl = 19;
            }
            var resolutionAtLevel = resolutions[lvl.ToString()];
            return resolutionAtLevel.UnitsPerPixel * pixelWith;
            //double scale = 2 * 78271.51696401953125 / (1 << lvl);
            // return scale * pixelWith;
        }
    }
}
