using System.Collections.Generic;

namespace MapService.DTOs.Map
{
    public class MapLayerDTO
    {
        public string LayerName { get; set; }
        public string LayerGroup { get; set; }

        public string DataSourceId { get; set; }

        public int? MinZoom { get; set; }
        public int? MaxZoom { get; set; }

        public Dictionary<string, object> PaintProperties { get; set; }
        public string Note { get; set; }
    }
}
