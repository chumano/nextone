using MapService.Domain;
using MapService.Utils;
using Newtonsoft.Json;
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
        public string ImageUrl { get; set; }

        public Dictionary<string, object> Properties { get;  set; }
        public List<Dictionary<string, object>> FeatureData { get; set; }

        public IList<string> Tags { get; set; }

        public static DataSourceDTO From(MapService.Domain.DataSource o)
        {
            string imageUrl = null;
            if (o.ImageData != null)
            {
                imageUrl = ImageHelper.BytesImageToBase64Url(o.ImageData);
            }
            List<Dictionary<string, object>> featureData = null;
            if (!string.IsNullOrWhiteSpace(o.FeatureData))
            {
                try
                {
                    featureData = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(o.FeatureData);
                }
                catch { }
            }
            return new DataSourceDTO()
            {
                Id = o.Id,
                Name = o.Name,
                DataSourceType = o.DataSourceType,
                GeoType = o.GeoType,
                SourceFile = o.SourceFile,
                ImageUrl = imageUrl,
                Tags = o.Tags,
                Properties = o.Properties,
                FeatureData = featureData
            };
        }
    }
}
