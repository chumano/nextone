using MapService.Domain;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace MapService.DTOs.DataSource
{
    public class CreateDataSourceDTO
    {
        public string Name { get; set; }

        public DataSourceTypeEnum DataSourceType { get; set; }
        public IList<string> Tags { get; set; }

        public IFormFile File { get; set; }
    }
}
