using MapService.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace MapService.DTOs.Map
{
    public class MapDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Note { get; set; }
        public IEnumerable<MapLayerDTO> Layers { get; set; }

        public static MapDTO From(MapInfo o)
        {
            return new MapDTO()
            {
                Id = o.Id,
                Name = o.Name,
                Note = o.Note,
                Layers = o.Layers.Select(l => new MapLayerDTO()
                {
                    LayerName = l.LayerName,
                    LayerGroup = l.LayerGroup,
                    DataSourceId = l.DataSourceId,
                    DataSourceName = l.DataSource.Name,
                    DataSourceGeoType = l.DataSource.GeoType,
                    MinZoom = l.MinZoom,
                    MaxZoom = l.MaxZoom,
                    Note = l.Note,
                    PaintProperties = l.PaintProperties
                })
            };
        }

        public static Expression<Func<MapInfo, MapDTO>> Projection
        {
            get
            {
                return o => new MapDTO();
            }
        }
    }
}
