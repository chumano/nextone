using MapService.Domain;
using MapService.DTOs.Map;
using System.Linq;

namespace MapService.DTOs
{
    public static class MapQueryObjects
    {
        public static IQueryable<MapDTO> //#A
           ToDto(this IQueryable<MapInfo> maps) //#A
        {
            return maps.Select(o => new MapDTO()
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
            });
        }
    }
}
