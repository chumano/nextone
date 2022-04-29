using MapService.DTOs.DataSource;
using System.Linq;

namespace MapService.DTOs
{
    public static class DataSourceQueryObjects
    {
        public static IQueryable<DataSourceDTO> //#A
           ToDto(this IQueryable<MapService.Domain.DataSource> objs) //#A
        {
            return objs.Select(o => new DataSourceDTO()
            {
                Id = o.Id,
                Name = o.Name,
                DataSourceType = o.DataSourceType,
                GeoType = o.GeoType,
                SourceFile = o.SourceFile,
                ImageData = o.ImageData,
                Tags = o.Tags,
                Properties = o.Properties
            });
        }
    }
}
