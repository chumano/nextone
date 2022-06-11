using ComService.Domain;
using System.Collections.Generic;

namespace ComService
{
    public class SeedData
    {
        public static IEnumerable<Settings> Settings => new Settings[]
        {
            new Domain.Settings()
            {
                Code = "MapDefaultZoom",
                Name = "Mức zoom",
                Value = "9",
                Group = "Bản đồ"
            },
            new Domain.Settings()
            {
                Code = "MapDefaultCenter",
                Name = "Tâm bản đồ",
                Value = "[10,108]", //lat,lon
                Group = "Bản đồ"
            },
            new Domain.Settings()
            {
                Code = "MapBounding",
                Name = "Vùng giới hạn",
                Value = "[[9.5, 107.5], [10.5, 108.5]]", //southWest northEast
                Group = "Bản đồ"
            },
            new Domain.Settings()
            {
                Code = "MapTileLayers",
                Name = "Lớp bản đồ nền",
                Value = "",
                Group = "Bản đồ"
            },
        };
    }
}
