using MapService.Domain;
using System.Collections.Generic;

namespace MapService.DTOs.Map
{
    public class UpdateMapDTO
    {
        public string Name { get; set; }
        public string Note { get; set; }
        public IList<UpdateMapLayerDTO> Layers { get; set; }
    }

    public class UpdateMapLayerDTO
    {

        public string LayerName { get; set; }
        public string LayerGroup { get; set; }

        public string DataSourceId { get; set; }

        public bool? Active { get; set; }
        public int? MinZoom { get; set; }
        public int? MaxZoom { get; set; }

        public Dictionary<string, object> PaintProperties { get; set; }
        public string Note { get; set; }
    }
}
