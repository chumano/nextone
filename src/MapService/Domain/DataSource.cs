using System.Collections.Generic;

namespace MapService.Domain
{
    public class DataSource
    {
        public string Id { get; set; }
        public string Name { get; set; }

        public DataSourceTypeEnum DataSourceType { get; set; }

        public GeoTypeEnum GeoType { get; set; }

        public string SourceFile { get; set; }

        public Dictionary<string, object> Properties { get; set; }

        public IList<string> Tags { get; set; }
    }

    public enum DataSourceTypeEnum
    {
        Shapefile
    }

    public enum GeoTypeEnum
    {
        Point,
        Line,
        Polygon
    }
}
