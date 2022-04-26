using System;
using System.Collections.Generic;

namespace MapService.Domain
{
    public class DataSource
    {
        private DataSource()
        {

        }
        public DataSource(string id, string name,
            DataSourceTypeEnum dataSourceType, GeoTypeEnum geoType,
            string sourceFile,
            Dictionary<string, object> props)
        {
            CreatedDate = DateTime.Now;
            Id = id;
            Name = name;
            DataSourceType = dataSourceType;
            GeoType = geoType;
            SourceFile = sourceFile;
            Properties = props;
        }

        public string Id { get; private set; }
        public string Name { get; private set; }

        public DataSourceTypeEnum DataSourceType { get; private set; }

        public GeoTypeEnum GeoType { get; private set; }

        public string SourceFile { get; private set; }

        public Dictionary<string, object> Properties { get; private set;}


        public IList<string> Tags { get; set; }

        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }

        public void Update(string name, IList<string> tags)
        {
            this.Name = name;
            this.Tags = tags;
            this.UpdatedDate = DateTime.Now;
        }
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
