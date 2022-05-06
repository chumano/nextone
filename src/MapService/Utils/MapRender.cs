﻿using GeoAPI.Geometries;
using MapService.Domain;
using MapService.Domain.Services;
using ProjNet.CoordinateSystems.Transformations;
using SharpMap;
using SharpMap.Data.Providers;
using SharpMap.Layers;
using SharpMap.Styles;
using System.Drawing;
using System.IO;

namespace MapService.Utils
{
    public class MapRenderOptions
    {
        public int PixelWidth { get; set; }
        public int? PixelHeight { get; set; }
        public int TargetSRID { get; set; }

        public double? MinX { private get; set; }
        public double? MinY { private get; set; }
        public double? MaxX { private get; set; }
        public double? MaxY { private get; set; }

        public Color BackgroundColor { get; set; }
        public MapRenderOptions()
        {
            PixelWidth = 512;
            PixelHeight = null;
            TargetSRID = 3857;
            BackgroundColor = Color.Transparent;
        }

        public Envelope Envelope { 
            get
            {
                if(!MinX.HasValue 
                    || !MinY.HasValue
                    || !MaxX.HasValue
                    || !MaxY.HasValue)
                    return null;

                var flipXY = TargetSRID == 4326;

                return flipXY
                   ? new Envelope(MinY.Value, MaxY.Value,  MinX.Value, MaxX.Value)
                   : new Envelope(MinX.Value, MaxX.Value,  MinY.Value, MaxY.Value);
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

        public Image RenderImage(Map  map, MapRenderOptions renderOptions)
        {
            var bbox = renderOptions.Envelope;
            if (bbox == null)
            {
                bbox = map.GetExtents();
            }

            var width = renderOptions.PixelWidth;
            var height = (int)(width * bbox.Height / bbox.Width);
            if (renderOptions.PixelHeight.HasValue)
            {
                height = renderOptions.PixelHeight.Value;
            }
            map.BackColor = renderOptions.BackgroundColor; //Color.Transparent; //Color.FromArgb(192, Color.Black)
            map.Size = new Size(width, height);
            map.PixelAspectRatio = (width / (double)height) / (bbox.Width / bbox.Height);
            map.Center = bbox.Centre;
            map.Zoom = bbox.Width;
            map.SRID = renderOptions.TargetSRID;

            var img = map.GetMap();
            //var imageName = Path.ChangeExtension(dataSource.SourceFile, ".jpg");
            //img.Save(imageName, System.Drawing.Imaging.ImageFormat.Jpeg);
            return img;
        }
    }
}