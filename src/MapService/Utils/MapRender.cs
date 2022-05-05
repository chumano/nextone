using MapService.Domain;
using ProjNet.CoordinateSystems.Transformations;
using SharpMap;
using SharpMap.Data.Providers;
using SharpMap.Layers;
using SharpMap.Styles;
using System.Drawing;
using System.IO;

namespace MapService.Utils
{
    public class MapRender
    {
        const int TargetSRID = 3857;
        private readonly int _width;
        public MapRender(int width = 200)
        {
            _width = width;
        }

        public Image RenderImage(MapInfo mapInfo)
        {
            Map map = new Map(new Size(1, 1));
            foreach (var mapLayer in mapInfo.Layers)
            {
                try
                {
                    if (!mapLayer.Active ?? false)
                    {
                        continue;
                    }
                    var vectorLayer = createLayer(mapLayer);
                    vectorLayer.Enabled = true;
                    map.Layers.Add(vectorLayer);
                }
                catch
                {

                }
            }

            var bbox = map.GetExtents();
            var width = _width;
            var height = (int)(width * bbox.Height / bbox.Width);
            map.BackColor = Color.White;
            map.Size = new Size(width, height);
            map.PixelAspectRatio = (width / (double)height) / (bbox.Width / bbox.Height);
            map.Center = bbox.Centre;
            map.Zoom = bbox.Width;
            map.SRID = TargetSRID;

            var img = map.GetMap();
            return img;
        }

        private VectorLayer createLayer(MapLayer mapLayer)
        {
            ShapeFile dataProvider = new ShapeFile(mapLayer.DataSource.SourceFile, true, true);

            var geoType = dataProvider.ShapeType.ToGeoType();
            var style = GetDefaultVectorStyle(geoType);

            var css = Session.Instance.CoordinateSystemServices;
            CoordinateTransformationFactory factory = new CoordinateTransformationFactory();
            var targetCoordinateSystem = css.GetCoordinateSystem(TargetSRID);
            var transform = factory.CreateFromCoordinateSystems(dataProvider.CoordinateSystem, targetCoordinateSystem);
            var reverseTransform = factory.CreateFromCoordinateSystems(targetCoordinateSystem, dataProvider.CoordinateSystem); ;

            var layer = new VectorLayer(mapLayer.LayerName, dataProvider);
            layer.Style = style;
            layer.CoordinateTransformation = transform;
            layer.ReverseCoordinateTransformation = reverseTransform;

            return layer;
        }

        public Image RenderImage(DataSource dataSource)
        {
            Image img;
            using (var dataProvider = new ShapeFile(dataSource.SourceFile, true))
            {
                img = RenderImage(dataProvider);
            }

            return img;
        }

        public Image RenderImage(ShapeFile dataProvider)
        {
            var geoType = dataProvider.ShapeType.ToGeoType();
            var style = GetDefaultVectorStyle(geoType);
         
            var css = Session.Instance.CoordinateSystemServices;
            CoordinateTransformationFactory factory = new CoordinateTransformationFactory();
            var targetCoordinateSystem = css.GetCoordinateSystem(TargetSRID);
            var transform = factory.CreateFromCoordinateSystems(dataProvider.CoordinateSystem, targetCoordinateSystem);
            var reverseTransform = factory.CreateFromCoordinateSystems(targetCoordinateSystem, dataProvider.CoordinateSystem); ;

            var layer = new VectorLayer("default", dataProvider);
            layer.Style = style;
            layer.CoordinateTransformation = transform;
            layer.ReverseCoordinateTransformation = reverseTransform;
            layer.Enabled = true;

            //set view
            Map map = new Map(new Size(1, 1));
            map.Layers.Add(layer);

            var bbox = layer.Envelope;
            var width = _width;
            var height = (int)(width * bbox.Height / bbox.Width);
            map.BackColor = Color.White;
            map.Size = new Size(width, height);
            map.PixelAspectRatio = (width / (double)height) / (bbox.Width / bbox.Height);
            map.Center = bbox.Centre; 
            map.Zoom = bbox.Width;
            map.SRID = TargetSRID;

            var img = map.GetMap();
            //var imageName = Path.ChangeExtension(dataSource.SourceFile, ".jpg");
            //img.Save(imageName, System.Drawing.Imaging.ImageFormat.Jpeg);
            return img;
        }

        private VectorStyle GetDefaultVectorStyle(GeoTypeEnum dataSource)
        {
            var style = new VectorStyle();
            style.Fill = new SolidBrush(Color.Black);
            style.Line = new Pen(new SolidBrush(Color.Black), 5);
            style.PointColor = new SolidBrush(Color.Black);
            style.PointSize = 10;
            return style;
        }
    }
}
