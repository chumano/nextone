using System;
using System.Collections.Generic;

namespace MapService.Domain
{
    public class DataSource
    {
        public const string SHAPE_FILE_PROP_COLUMNS = "ShapeFile_Columns";
        public const string SHAPE_FILE_PROP_SRID = "ShapeFile_SRID";
        public const string SHAPE_FILE_PROP_FEATURECOUNT= "ShapeFile_FeatureCount";


        private DataSource()
        {

        }
        public DataSource(string id, string name,
            DataSourceTypeEnum dataSourceType, GeoTypeEnum geoType,
            string sourceFile,
            Dictionary<string, object> props,
            string featureData = "")
        {
            CreatedDate = DateTime.Now;
            Id = id;
            Name = name;
            DataSourceType = dataSourceType;
            GeoType = geoType;
            SourceFile = sourceFile;
            Properties = props;
            FeatureData = featureData;
        }

        public string Id { get; private set; }
        public string Name { get; private set; }

        public DataSourceTypeEnum DataSourceType { get; private set; }

        public GeoTypeEnum GeoType { get; private set; }

        public string SourceFile { get; private set; }

        public Dictionary<string, object> Properties { get; private set;}
        public string FeatureData { get; private set; }


        public IList<string> Tags { get; set; }

        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }

        public byte[] ImageData { get; set; }

        private MapBoundingBox _bb;
        public MapBoundingBox BoundingBox {
            get
            {
                if(_bb == null)
                {
                    _bb = new MapBoundingBox(_bbMinX ?? 0, _bbMixY ?? 0, _bbMaxX ?? 0, _bbMaxY ?? 0);
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
