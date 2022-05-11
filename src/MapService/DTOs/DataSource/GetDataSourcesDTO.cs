using MapService.Domain;
using System.Collections.Generic;

namespace MapService.DTOs.DataSource
{
    public class GetDataSourcesDTO
    {
        public string TextSearch { get; set; }
        public List<GeoTypeEnum> GeoTypes { get; set; }
        public int Offset { get; set; }
        public int PageSize { get; set; }
    }
    public class CountDataSourcesDTO
    {
        public string TextSearch { get; set; }
        public List<GeoTypeEnum> GeoTypes { get; set; }
    }

}
