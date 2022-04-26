using MapService.Domain;
using SharpMap.Data.Providers;

namespace MapService.Utils
{
    public static class GeoHelper
    {
        public static GeoTypeEnum ToGeoType(this ShapeType shapeType)
        {
            switch (shapeType)
            {
                case ShapeType.Polygon:
                case ShapeType.PolygonM:
                case ShapeType.PolygonZ:
                    return GeoTypeEnum.Polygon;

                case ShapeType.PolyLine:
                case ShapeType.PolyLineM:
                case ShapeType.PolyLineZ:
                    return GeoTypeEnum.Line;

                case ShapeType.MultiPointM:
                case ShapeType.MultiPointZ:
                case ShapeType.Multipoint:
                case ShapeType.Point:
                case ShapeType.PointM:
                case ShapeType.PointZ:
                    return GeoTypeEnum.Point;

                default:
                    throw new System.Exception($"Not support ShapeType {shapeType}");
            }
        }
    }
}
