using System.Collections.Generic;

namespace MapService.DTOs.DataSource
{
    public class UpdateDataSourceDTO
    {
        public string Name { get; set; }
        public IList<string> Tags { get; set; }
    }
}
