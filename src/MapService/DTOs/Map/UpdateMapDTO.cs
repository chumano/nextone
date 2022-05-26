using MapService.Domain;
using System.Collections.Generic;

namespace MapService.DTOs.Map
{
    public class UpdateMapNameDTO
    {
        public string Name { get; set; }
        public double OffsetX { get; set; }
        public double OffsetY { get; set; }
        public string Note { get; set; }
    }

    public class UpdateMapDTO
    {
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
