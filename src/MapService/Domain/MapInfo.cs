using System;
using System.Collections.Generic;

namespace MapService.Domain
{
    public class MapInfo
    {
        private MapInfo() { }

        public MapInfo(string id, string name, string note)
        {
            Id = id;
            Name = name;
            Note = note;
            Layers = new List<MapLayer>();
            CreatedDate = DateTime.Now;
        }
        public string Id { get; private set; }
        public string Name { get; set; }
        public string Note { get; set; }

        public byte[] ImageData { get; set; }

        public ICollection<MapLayer> Layers { get; set; }

        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
    }

    public class MapLayer
    {
        public string MapId { get; set; }
        public int LayerIndex { get; set; }

        public string LayerName { get; set; }
        public string LayerGroup { get; set; }

        public string DataSourceId { get; set; }
        public DataSource DataSource { get; set; }

        public bool? Active { get; set; }
        public int? MinZoom { get; set; }
        public int? MaxZoom { get; set; }
        public Dictionary<string, object>  PaintProperties { get; set; }
        public string Note { get; set; }

    }
}
