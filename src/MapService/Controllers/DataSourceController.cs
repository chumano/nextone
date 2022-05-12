using MapService.Domain;
using MapService.Domain.Repositories;
using MapService.DTOs;
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
using NextOne.Shared.Extenstions;
using Newtonsoft.Json;
using System.Drawing.Imaging;
using Microsoft.AspNetCore.Authorization;
using MapService.Authorization;

namespace MapService.Controllers
{
    [Authorize(Policy = AppAuthorizationPolicy.AdminRole)]
    [Route("datasources")]
    [ApiController]
    public class DataSourceController : ControllerBase
    {
        private readonly ILogger<DataSourceController> _logger;
        private readonly IDataSourceRepository _dataSourceRepository;
        private readonly IdGenerator _idGenerator;
        private readonly IMapRender _mapRender;
        public DataSourceController(ILogger<DataSourceController> logger,
            IdGenerator idGenerator,
            IDataSourceRepository dataSourceRepository,
            IMapRender mapRender)
        {
            _logger = logger;
            _idGenerator = idGenerator;
            _dataSourceRepository = dataSourceRepository;
            _mapRender = mapRender;
        }

        [HttpGet("count")]
        public async Task<IActionResult> Count([FromQuery] CountDataSourcesDTO getDataSourcesDTO)
        {
           
            var query = _dataSourceRepository.DataSources;
            var tagSearch = "," + getDataSourcesDTO.TextSearch + ",";
            if (!string.IsNullOrWhiteSpace(getDataSourcesDTO.TextSearch))
            {
                query = query.Where(o => o.Name.Contains(getDataSourcesDTO.TextSearch) || o.RawTags.Contains(tagSearch));
            }
            if (getDataSourcesDTO.GeoTypes != null && getDataSourcesDTO.GeoTypes.Count > 0)
            {
                query = query.Where(o => getDataSourcesDTO.GeoTypes.Contains(o.GeoType));
            }

            var count = await query.CountAsync();

            return Ok(count);
        }

        [HttpGet]
        public async Task<IActionResult> GetDataSources([FromQuery] GetDataSourcesDTO getDataSourcesDTO)
        {
            var pagingOptions = new PageOptions(getDataSourcesDTO.Offset, getDataSourcesDTO.PageSize);
            var query =  _dataSourceRepository.DataSources;
            var tagSearch = "," + getDataSourcesDTO.TextSearch + ",";
            if (!string.IsNullOrWhiteSpace(getDataSourcesDTO.TextSearch))
            {
                query = query.Where(o => o.Name.Contains(getDataSourcesDTO.TextSearch) || o.RawTags.Contains(tagSearch));
            }
            if (getDataSourcesDTO.GeoTypes !=null && getDataSourcesDTO.GeoTypes.Count>0)
            {
                query = query.Where(o => getDataSourcesDTO.GeoTypes.Contains(o.GeoType));
            }

            var datasources  = await query.OrderByDescending(o=>o.CreatedDate)
                    .Skip(pagingOptions.Offset)
                    .Take(pagingOptions.PageSize)
                    .ToListAsync();

            return Ok(datasources.Select(o =>
            {
                return DataSourceDTO.From(o);
            }));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var datasource = await _dataSourceRepository.Get(id);
            if (datasource == null)
            {
                throw new Exception($"DataSource {id} is not found");
            }

            return Ok(DataSourceDTO.From(datasource));
        }

        [HttpPost("Create")]
        public async Task<IActionResult> CreateDataSource([FromForm] CreateDataSourceDTO createDataSourceDTO)
        {
            if (createDataSourceDTO.File == null)
            {
                throw new Exception("File is not found");
            }

            var existNameObj = await _dataSourceRepository.DataSources.Where(o => o.Name == createDataSourceDTO.Name).FirstOrDefaultAsync();

            if (existNameObj != null)
            {
                throw new Exception($"DataSource Name is in use");
            }

            var nameOnly = Path.GetFileNameWithoutExtension(createDataSourceDTO.File.FileName);
            var ext = Path.GetExtension(createDataSourceDTO.File.FileName);
            if (ext.ToLower() != ".zip")
            {
                throw new Exception("Need to ShapeFile Zip");
            }
            var newId = _idGenerator.GenerateNew();

            var filePath = await SaveFile(createDataSourceDTO.File, "Data/Uploads");
            var shapefileFolder = nameOnly.ToSafeFileName() + "_" + newId;
            var mapFolder = Path.Combine("Data/ShapeFiles", shapefileFolder);

            var files = ZipHelper.Unzip(filePath, mapFolder);
            var shapefilePath = files.FirstOrDefault(o => o.ToLower().Contains(".shp"));
            if (string.IsNullOrWhiteSpace(shapefilePath))
            {
                throw new Exception($"Can't found .shp in {createDataSourceDTO.File.FileName}");
            }

            //TODO: delete files if have something wrong
            var shapeFileInfo = ShapefileHelper.ReadShapeFile(shapefilePath, _mapRender);

            var geoType = shapeFileInfo.GeometryType.ToGeoType();

            var props = new Dictionary<string, object>();
            props.Add(DataSource.SHAPE_FILE_PROP_FEATURECOUNT, shapeFileInfo.FeatureCount);
            props.Add(DataSource.SHAPE_FILE_PROP_SRID, shapeFileInfo.SRID);
            props.Add(DataSource.SHAPE_FILE_PROP_COLUMNS, shapeFileInfo.Columns);

            var dataSource = new DataSource(newId,
                createDataSourceDTO.Name,
                createDataSourceDTO.DataSourceType,
                geoType,
                shapefilePath,
                props,
                featureData: JsonConvert.SerializeObject(shapeFileInfo.AttributeData)
                )
            {
                Tags = createDataSourceDTO.Tags,
            };

            dataSource.SetBoudingBox(
                new MapBoundingBox(shapeFileInfo.Extents.MinX, 
                shapeFileInfo.Extents.MinY, 
                shapeFileInfo.Extents.MaxX, 
                shapeFileInfo.Extents.MaxY));

            if (shapeFileInfo.Image != null)
            {
                var bytes = ImageHelper.ImageToByteArray(shapeFileInfo.Image, ImageFormat.Jpeg);
                dataSource.ImageData = bytes;
            }

            _dataSourceRepository.Add(dataSource);

            await _dataSourceRepository.SaveChangesAsync();
            //TODO: send DomainEvent DataSoruceCreated

            return Ok(DataSourceDTO.From(dataSource));
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

            datasource.Update(updateDataSourceDTO.Name, updateDataSourceDTO.Tags);

            _dataSourceRepository.Update(datasource);
            await _dataSourceRepository.SaveChangesAsync();

            //TODO: send DomainEvent DataSoruceUpdated
            return Ok(DataSourceDTO.From(datasource));
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
            var folder = Path.GetDirectoryName(datasource.SourceFile);
            if (Directory.Exists(folder))
            {
                Directory.Delete(folder, true);
            }

            //TODO: send DomainEvent DataSoruceDeleted
            return Ok(datasource);
        }
    }
}
