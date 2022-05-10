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

        public int Version { get; set; }

        private MapBoundingBox _bb;
        public MapBoundingBox BoundingBox
        {
            get
            {
                if (_bb == null)
                {
                    if( (_bbMinX ?? 0) == 0 && (_bbMixY ?? 0) == 0 &&  (_bbMaxX ?? 0) == 0 && ( _bbMaxY ?? 0) == 0)
                    {
                        _bb = null;
                    }
                    else
                    {
                        _bb = new MapBoundingBox(_bbMinX ?? 0, _bbMixY ?? 0, _bbMaxX ?? 0, _bbMaxY ?? 0);
                    }
                }
                return _bb;
            }
        }

        public void SetBoudingBox(MapBoundingBox bb)
        {
            _bbMinX = bb.MinX;
            _bbMixY = bb.MinY;
            _bbMaxX = bb.MaxX;
            _bbMaxY = bb.MaxY;
            _bb = new MapBoundingBox(_bbMinX ?? 0, _bbMixY ?? 0, _bbMaxX ?? 0, _bbMaxY ?? 0);
        }

        private double? _bbMinX;
        private double? _bbMixY;
        private double? _bbMaxX;
        private double? _bbMaxY;

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
