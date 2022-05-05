using MapService.Domain;
using MapService.Utils;
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
        public string ImageUrl { get; set; }
        public IEnumerable<MapLayerDTO> Layers { get; set; }

        public static MapDTO From(MapInfo o)
        {
            string imageUrl = null;
            if (o.ImageData != null)
            {
                imageUrl = ImageHelper.BytesImageToBase64Url(o.ImageData);
            }
            return new MapDTO()
            {
                Id = o.Id,
                Name = o.Name,
                Note = o.Note,
                ImageUrl = imageUrl,
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
