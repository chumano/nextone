using MapService.Domain;
using System.Collections.Generic;

namespace MapService.DTOs.DataSource
{
    public class DataSourceDTO
    {
        public string Id { get; set; }
        public string Name { get;  set; }

        public DataSourceTypeEnum DataSourceType { get;  set; }

        public GeoTypeEnum GeoType { get;  set; }

        public string SourceFile { get;  set; }
        public byte[] ImageData { get; set; }
        public string ImageUrl { get; set; }

        public Dictionary<string, object> Properties { get;  set; }


        public IList<string> Tags { get; set; }
    }
}
