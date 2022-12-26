using MasterService.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NextOne.Infrastructure.Core;
using System;
using System.Threading.Tasks;

namespace MasterService.Boudaries.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class SystemController : ControllerBase
    {
        private readonly DatabaseManager _databaseManager;
        public SystemController(DatabaseManager databaseManager)
        {
            _databaseManager = databaseManager;
        }
        [HttpGet("GetBackups")]
        public async Task<IActionResult> GetBackupList()
        {
            var backups = await _databaseManager.GetBackups();
            return Ok(ApiResult.Success(backups));
        }

        [HttpPost("Backup")]
        public async Task<IActionResult> Backup()
        {
            try
            {
                await _databaseManager.Backup();
                return Ok(ApiResult.Success(null));
            }catch(Exception ex)
            {
                return Ok(ApiResult.Error(ex.Message));
            }
            
        }

        [HttpGet("GetBackupSchedule")]
        public async Task<IActionResult> GetBackupSchedule()
        {
            var backupSchedule = await _databaseManager.GetBackupSchedule();
            return Ok(ApiResult.Success(backupSchedule));
        }

        [HttpPost("UpdateBackupSchedule")]
        public async Task<IActionResult> UpdateBackupSchedule([FromBody] DBBackupSchedule dBBackupSchedule)
        {
            await _databaseManager.UpdateBackupSchedule(dBBackupSchedule);
            return Ok(ApiResult.Success(null));
        }
    }
}
