using MapService.Domain;
using MapService.Utils;

namespace MapService.DTOs.Map
{
    public class MapTileUrlDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Note { get; set; }
        public string ImageUrl { get; set; }
        public int Version { get; set; }
        public string CurrentTileUrl { get; set; }
        public string LatestTileUrl { get; set; }

        public MapBoundingBox BoundingBox { get; set; }

        public static MapTileUrlDTO From(MapInfo o)
        {
            string imageUrl = null;
            if (o.ImageData != null)
            {
                imageUrl = ImageHelper.BytesImageToBase64Url(o.ImageData);
            }
            return new MapTileUrlDTO()
            {
                Id = o.Id,
                Name = o.Name,
                Note = o.Note,
                Version = o.Version,
                BoundingBox = o.BoundingBox,
                ImageUrl = imageUrl,
                CurrentTileUrl = $"/tms/{o.Version}/map-{o.Id}" + "/{z}/{x}/{y}.png",
                LatestTileUrl = $"/tms/latest/map-{o.Id}" + "/{z}/{x}/{y}.png",
            };
        }

    }
}
