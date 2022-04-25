using MapService.Domain;
using MapService.Domain.Repositories;
using MapService.DTOs.DataSource;
using MapService.Infrastructure;
using MapService.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NextOne.Shared.Common;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MapService.Controllers
{
    [Route("datasources")]
    [ApiController]
    public class DataSourceController : ControllerBase
    {
        private readonly ILogger<DataSourceController> _logger;
        private readonly IDataSourceRepository _dataSourceRepository;
        private readonly IdGenerator _idGenerator;
        public DataSourceController(ILogger<DataSourceController> logger,
            IdGenerator idGenerator,
            IDataSourceRepository dataSourceRepository)
        {
            _logger = logger;
            _idGenerator = idGenerator;
            _dataSourceRepository = dataSourceRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetDataSources()
        {
            var datasources = await _dataSourceRepository.DataSources.ToListAsync();
            return Ok(datasources);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var datasource = await _dataSourceRepository.Get(id);
            if (datasource == null)
            {
                throw new Exception($"DataSource {id} is not found");
            }

            return Ok(datasource);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> CreateDataSource([FromForm] CreateDataSourceDTO createDataSourceDTO)
        {
            //Validate:
            //1. File .zip : shapefile
            var ext = Path.GetExtension(createDataSourceDTO.File.FileName);
            if (ext.ToLower() != ".zip")
            {
                throw new Exception("Need to ShapeFile Zip");
            }

            var filePath = await SaveFile(createDataSourceDTO.File, "Data/Uploads");
            var mapFolder = "Data/ShapeFiles";
            var files = ZipHelper.Unzip(filePath, mapFolder);
            var shapefilePath = files.FirstOrDefault(o => o.ToLower().Contains(".shp"));
            if (string.IsNullOrWhiteSpace(shapefilePath))
            {
                throw new Exception($"Can't found .shp in {createDataSourceDTO.File.FileName}");
            }
            var shapeFileInfo = ShapefileHelper.ReadShapeFile(shapefilePath);

            var geoType = GeoTypeEnum.Point;
            var sourceFile = filePath;
            var props = new Dictionary<string, object>();
            props.Add("shapfile", shapeFileInfo);

            var newId = _idGenerator.GenerateNew();
            var dataSource = new DataSource()
            {
                Id = newId,
                DataSourceType = createDataSourceDTO.DataSourceType,
                Name = createDataSourceDTO.Name,
                Tags = createDataSourceDTO.Tags,

                GeoType = geoType,
                SourceFile = sourceFile,
                Properties = props
            };
            
            _dataSourceRepository.Add(dataSource);


            await _dataSourceRepository.SaveChangesAsync();
            //TODO: send DomainEvent DataSoruceCreated

            return Ok(dataSource);
        }

        private async Task<string> SaveFile(IFormFile file, string fileFolder)
        {
            var name_only = Path.GetFileNameWithoutExtension(file.FileName);
            var ext = Path.GetExtension(file.FileName);
            var file_name = string.Format("{0}{1}", name_only, ext);

            Directory.CreateDirectory(fileFolder);

            string path = Path.Combine(fileFolder,file_name);
            using (Stream fileStream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return path;
        }

        [HttpPost("Update/{id}")]
        public async Task<IActionResult> UpdateDataSource(string id, [FromBody] UpdateDataSourceDTO updateDataSourceDTO)
        {
            var datasource = await _dataSourceRepository.Get(id);
            if(datasource == null)
            {
                throw new Exception($"DataSource {id} is not found");
            }

            datasource.Name = updateDataSourceDTO.Name;
            datasource.Tags = updateDataSourceDTO.Tags;
            _dataSourceRepository.Update(datasource);
            await _dataSourceRepository.SaveChangesAsync();

            //TODO: send DomainEvent DataSoruceUpdated
            return Ok(datasource);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDataSource(string id)
        {
            var datasource = await _dataSourceRepository.Get(id);
            if (datasource == null)
            {
                throw new Exception($"DataSource {id} is not found");
            }
            _dataSourceRepository.Delete(datasource);

            await _dataSourceRepository.SaveChangesAsync();

            //TODO: delete sourceFile
            //TODO: send DomainEvent DataSoruceDeleted
            return Ok(datasource);
        }
    }
}
