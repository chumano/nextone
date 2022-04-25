using System.Collections.Generic;

namespace MapService.Domain
{
    public class MapInfo
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Note { get; set; }
        public IList<MapLayer> Layers { get; set; }

    }

    public class MapLayer
    {
        public string MapId { get; set; }
        public int LayerIndex { get; set; }

        public string LayerName { get; set; }
        public string LayerGroup { get; set; }

        public string DataSourceId { get; set; }
        public DataSource DataSource { get; set; }

        public int? MinZoom { get; set; }
        public int? MaxZoom { get; set; }
        public Dictionary<string, object>  PaintProperties { get; set; }
        public string Note { get; set; }

    }
}
