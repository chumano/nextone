using BruTile.Predefined;
using GeoAPI;
using GeoAPI.CoordinateSystems;
using GeoAPI.CoordinateSystems.Transformations;
using GeoAPI.Geometries;
using MapService.Domain.Repositories;
using MapService.Utils;
using Microsoft.Extensions.Logging;
using ProjNet.CoordinateSystems.Transformations;
using SharpMap;
using SharpMap.Data.Providers;
using SharpMap.Layers;
using SharpMap.Rendering.Thematics;
using SharpMap.Styles;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Globalization;
using System.IO;
using System.Threading.Tasks;

namespace MapService.Domain.Services
{
    public interface ISharpMapFactory
    {
        Envelope TransformToLatLng(Envelope envelope, int fromSRID = 3857);
        SharpMap.Map GenerateMap(MapInfo mapInfo, int TargetSRID = 3857);
        SharpMap.Map GenerateMap(ShapeFile dataProvider, int TargetSRID = 3857);
    }
    public class SharpMapFactory : ISharpMapFactory
    {
        private readonly GlobalSphericalMercator _schema = MapUtils.DeaultMapSchema;
        private readonly CoordinateTransformationFactory _coordinateTransformationFactory;
        private readonly ICoordinateSystemServices _css;
        private readonly ILogger<SharpMapFactory> _logger;
        private readonly IIconSymbolRepository _symbolRepository;
        public SharpMapFactory(ILogger<SharpMapFactory> logger, IIconSymbolRepository iconSymbolRepository)
        {
            _coordinateTransformationFactory = new CoordinateTransformationFactory();
            _css = Session.Instance.CoordinateSystemServices;
            _logger = logger;
            _symbolRepository = iconSymbolRepository;
        }

        public Envelope TransformToLatLng(Envelope envelope, int fromSRID = 3857)
        {
            var from = _css.GetCoordinateSystem(fromSRID);
            var target = _css.GetCoordinateSystem(4326);
            var transform = _coordinateTransformationFactory.CreateFromCoordinateSystems(from, target);

            return GeometryTransform.TransformBox(envelope, transform.MathTransform);
        }
        public SharpMap.Map GenerateMap(MapInfo mapInfo, int TargetSRID = 3857)
        {
            Map map = new Map(new Size(1, 1));

            var targetCoordinateSystem = _css.GetCoordinateSystem(TargetSRID);;

            var labelLayers = new List<LabelLayer>();
            foreach (var mapLayer in mapInfo.Layers)
            {
                try
                {
                    if (!mapLayer.Active ?? false)
                    {
                        continue;
                    }
                    var layer = createLayer(mapLayer, targetCoordinateSystem, out LabelLayer labelLayer);
                    layer.Enabled = true;
                    map.Layers.Add(layer);

                    if (labelLayer != null)
                    {
                        labelLayers.Add(labelLayer);
                    }
                }
                catch(Exception ex)
                {
                    _logger.LogError(ex, $"GenerateMap ${mapInfo.Name}(${mapInfo.Id}) - ${mapLayer.LayerName} Error: {ex.Message}");
                }
            }

            foreach(var labelLayer in labelLayers)
            {
                labelLayer.Enabled = true;
                map.Layers.Add(labelLayer);
            }

            return map;
        }

        public SharpMap.Map GenerateMap(ShapeFile dataProvider, int TargetSRID = 3857)
        {
            var geoType = dataProvider.ShapeType.ToGeoType();
            var style = GetDefaultVectorStyle(geoType);

            var targetCoordinateSystem = _css.GetCoordinateSystem(TargetSRID);
            var transform = _coordinateTransformationFactory.CreateFromCoordinateSystems(dataProvider.CoordinateSystem, targetCoordinateSystem);
            var reverseTransform = _coordinateTransformationFactory.CreateFromCoordinateSystems(targetCoordinateSystem, dataProvider.CoordinateSystem);

            var layer = new VectorLayer("default", dataProvider);
            layer.Style = style;
            layer.CoordinateTransformation = transform;
            layer.ReverseCoordinateTransformation = reverseTransform;
            layer.Enabled = true;

            //set view
            Map map = new Map(new Size(1, 1));
            map.Layers.Add(layer);

            return map;
        }

        private Layer createLayer(MapLayer mapLayer, ICoordinateSystem targetCoordinateSystem,out LabelLayer labelLayer)
        {
            ShapeFile dataProvider = new ShapeFile(mapLayer.DataSource.SourceFile, true, true);

            var transform = _coordinateTransformationFactory.CreateFromCoordinateSystems(dataProvider.CoordinateSystem, targetCoordinateSystem);
            var reverseTransform = _coordinateTransformationFactory.CreateFromCoordinateSystems(targetCoordinateSystem, dataProvider.CoordinateSystem);

            
            Layer layer;
            labelLayer = null;

            //vectorLayer
            var vectorStyle = GetVectorStyle(mapLayer, out var theme, out var labelStyle, out var textColumn, out var textRotateColumn);
            var vectorlayer = new VectorLayer(mapLayer.LayerName, dataProvider);
            vectorlayer.Style = vectorStyle;
            vectorlayer.Theme = theme;
            layer = vectorlayer;

            if (labelStyle != null)
            {
                //labelLayer
                //var labelStyle = GetLabelStyle(mapLayer, out var textColumn, out var textRotateColumn);
                var labellayer = new LabelLayer(mapLayer.LayerName);
                labellayer.DataSource = dataProvider;
                labellayer.Style = labelStyle;
                if (!string.IsNullOrEmpty(textColumn))
                {
                    labellayer.LabelColumn = textColumn;
                }

                if (!string.IsNullOrEmpty(textRotateColumn))
                {
                    labellayer.RotationColumn = textRotateColumn;
                }


                labellayer.CoordinateTransformation = transform;
                labellayer.ReverseCoordinateTransformation = reverseTransform;
                labellayer.MinVisible = mapLayer.MinZoom ?? 1;
                labellayer.MaxVisible = mapLayer.MaxZoom ?? 19;

                labelLayer = labellayer;
            }
       
            layer.CoordinateTransformation = transform;
            layer.ReverseCoordinateTransformation = reverseTransform;
            layer.MinVisible = mapLayer.MinZoom ?? 1;
            layer.MaxVisible =mapLayer.MaxZoom ?? 19;
            return layer;
        }

     

        private VectorStyle GetVectorStyle(MapLayer mapLayer, out ITheme theme, 
            out LabelStyle labelStyle, out string textColumn, out string textRotateColumn)
        {
            theme = null;
            labelStyle = null;
            textColumn = null;
            textRotateColumn = null;
            try
            {
                
                if (mapLayer.PaintProperties == null)
                {
                    return GetDefaultVectorStyle(mapLayer.DataSource.GeoType);
                }

                var style = new VectorStyle();
                SetStyleCommon(style, mapLayer.PaintProperties);
               

                switch (mapLayer.DataSource.GeoType)
                {
                    case GeoTypeEnum.Point:
                        SetStylePoint(style, mapLayer.PaintProperties);
                        break;
                    case GeoTypeEnum.Line:
                        SetStyleLine(style, mapLayer.PaintProperties);
                        break;
                    case GeoTypeEnum.Polygon:
                        SetStyleFill(style, mapLayer.PaintProperties, out theme);
                        break;
                }

                var textEnabled = GetValue<bool>(mapLayer.PaintProperties, PaintPropertyKeys.TextEnabled, false);
                if (textEnabled)
                {
                    labelStyle = GetLabelStyle(mapLayer, out textColumn, out textRotateColumn);
                }

                return style;
            }catch(Exception ex)
            {
                _logger.LogError(ex, $"GetVectorStyle Error: {ex.Message}");
                return GetDefaultVectorStyle(mapLayer.DataSource.GeoType);
            }
        }

        private LabelStyle GetLabelStyle(MapLayer mapLayer, out string textColumn, out string textRotateColumn)
        {
            var labelStyle = new LabelStyle();
            SetStyleText(labelStyle, mapLayer.PaintProperties, out  textColumn, out  textRotateColumn);
            return labelStyle;
        }

        private void SetStylePoint(VectorStyle style, Dictionary<string, object> properites)
        {
            var defaultSymbolPath = "Data/IconSymbols/beachflag.png";
            var pointColor = GetValue<string>(properites, PaintPropertyKeys.PointColor, "#000000");
            var pointSize = GetValue<float>(properites, PaintPropertyKeys.PointSize, 5.0f);

            var symbolEnabled = GetValue<bool>(properites, PaintPropertyKeys.SymbolEnabled, false);
            var symbolName = GetValue<string>(properites, PaintPropertyKeys.SymbolImage, "");
            var symbolScale = GetValue<float>(properites, PaintPropertyKeys.SymbolScale, 1.0f);
           

            if (symbolEnabled)
            {
                Bitmap bmSymbol = null;
                var iconSymbol = _symbolRepository.Get(symbolName).GetAwaiter().GetResult();
                if(iconSymbol == null)
                {
                    bmSymbol  = new Bitmap(defaultSymbolPath);
                }
                else
                {
                    var img = ImageHelper.ImageFroBytes(iconSymbol.ImageData);
                    bmSymbol = new Bitmap(img);
                }
                
                style.Symbol = bmSymbol;
                style.SymbolScale = symbolScale;
            }
            else
            {
                style.PointColor = new SolidBrush(ColorHelper.FromHex(pointColor));
                style.PointSize = pointSize;
            }

        }

        private void SetStyleLine(VectorStyle style, Dictionary<string, object> properites)
        {
            var lineColor = GetValue<string>(properites, PaintPropertyKeys.LineColor, "#000000");
            var lineWidth = GetValue<float>(properites, PaintPropertyKeys.LineWidth, 1.0f);
            var lineStyle = GetValue<int>(properites, PaintPropertyKeys.LineStyle, (int)DashStyle.Solid);

            style.Line = new Pen(ColorHelper.FromHex(lineColor), lineWidth);
            style.Line.DashStyle = (DashStyle)lineStyle;
        }

        private void SetStyleFill(VectorStyle style, Dictionary<string, object> properites, out ITheme theme )
        {
            theme = null;
            var themeEnabled = GetValue<bool>(properites, PaintPropertyKeys.ThemeEnabled, false);
            if (themeEnabled)
            {
                var themeColumn = GetValue<string>(properites, PaintPropertyKeys.ThemeColumn, "");
                var themeColumnMin = GetValue<double>(properites, PaintPropertyKeys.ThemeColumnMin, 0);
                var themeColumnMax = GetValue<double>(properites, PaintPropertyKeys.ThemeColumnMax, 100);
                var themeColor1 = GetValue<string>(properites, PaintPropertyKeys.ThemeColor1, "#ff0000");
                var themeColor2 = GetValue<string>(properites, PaintPropertyKeys.ThemeColor2, "#00ff00");
                var themeColor3 = GetValue<string>(properites, PaintPropertyKeys.ThemeColor3, "#0000ff");

                VectorStyle min = new VectorStyle();

                VectorStyle max = min;

                GradientTheme popdens = new GradientTheme(themeColumn, themeColumnMin, themeColumnMax, min, max);
                Color Color1 = ColorHelper.FromHex(themeColor1);
                Color Color2 = ColorHelper.FromHex(themeColor2);
                Color Color3 = ColorHelper.FromHex(themeColor3);
                popdens.FillColorBlend = SharpMap.Rendering.Thematics.ColorBlend.ThreeColors(Color1, Color2, Color3);
                popdens.LineColorBlend = SharpMap.Rendering.Thematics.ColorBlend.ThreeColors(Color.Black, Color.Black, Color.Black);
                theme = popdens;
            }
            else
            {
                var fillTransparentEnabled = GetValue<bool>(properites, PaintPropertyKeys.FillTransparentEnabled, false);
                var fillColor = GetValue<string>(properites, PaintPropertyKeys.FillColor, "#000000");
                if (fillTransparentEnabled)
                {
                    style.Fill = new SolidBrush(Color.Transparent);
                }
                else
                {
                    style.Fill = new SolidBrush(ColorHelper.FromHex(fillColor));
                }
            }
        }

        private void SetStyleText(LabelStyle style, Dictionary<string, object> properites,
            out string textColumn, out string textRotateColumn)
        {
            textColumn = "";
            textRotateColumn = "";
            var textEnabled = GetValue<bool>(properites, PaintPropertyKeys.TextEnabled, false);
            if (!textEnabled) return;

            textColumn = GetValue<string>(properites, PaintPropertyKeys.TextColumn, "");
            var textColor = GetValue<string>(properites, PaintPropertyKeys.TextColor, "#000000");
            var textSize = GetValue<int>(properites, PaintPropertyKeys.TextSize, 12);
            var textFont = GetValue<string>(properites, PaintPropertyKeys.TextFont, "Arial");

            style.ForeColor = ColorHelper.FromHex(textColor);
            style.Font = new Font(textFont, textSize, FontStyle.Regular);

            var textHaloEnabled = GetValue<bool>(properites, PaintPropertyKeys.TextHaloEnabled, false);
            if (textHaloEnabled)
            {
                var textHaloColor = GetValue<string>(properites, PaintPropertyKeys.TextHaloColor, "#000000");
                var textHaloWidth = GetValue<int>(properites, PaintPropertyKeys.TextHaloWidth, 1);
                style.Halo = new Pen(ColorHelper.FromHex(textHaloColor), textHaloWidth);
            }
            style.HorizontalAlignment = LabelStyle.HorizontalAlignmentEnum.Left;
            style.VerticalAlignment = LabelStyle.VerticalAlignmentEnum.Bottom;


            var textRotateEnabled = GetValue<bool>(properites, PaintPropertyKeys.TextRotateEnabled, false);
            if (textRotateEnabled)
            {
                textRotateColumn = GetValue<string>(properites, PaintPropertyKeys.TextRotateColumn, "");
            }
        }

        private void SetStyleCommon(VectorStyle style, Dictionary<string, object> properites)
        {
            var outlineEnabled = GetValue<bool>(properites, PaintPropertyKeys.OutlineEnabled, false);
            if (!outlineEnabled) return;

            var outlineColor = GetValue<string>(properites, PaintPropertyKeys.OutlineColor, "#000000");
            var outlineWidth = GetValue<float>(properites, PaintPropertyKeys.OutlineWidth, 1.0f);
            var outlineStyle = GetValue<int>(properites, PaintPropertyKeys.OutlineStyle, (int)DashStyle.Solid);

            style.EnableOutline = true;
            style.Outline = new Pen(ColorHelper.FromHex(outlineColor), outlineWidth);
            style.Outline.DashStyle = (DashStyle)outlineStyle;
        }

        private T GetValue<T>(Dictionary<string, object> properites , string key, T defaultValue = default(T))
        {
            if(properites == null)
            {
                return defaultValue;
            }
            var value = properites.GetValueOrDefault(key,defaultValue);
            return (T)Convert.ChangeType(value, typeof(T), CultureInfo.InvariantCulture);
        }

        private VectorStyle GetDefaultVectorStyle(GeoTypeEnum geoType)
        {
            var style = new VectorStyle();
            style.Fill = new SolidBrush(Color.Black);
            style.Line = new Pen(new SolidBrush(Color.Black), 1);
            style.PointColor = new SolidBrush(Color.Black);
            style.PointSize = 10;
            return style;
        }
    }
}
