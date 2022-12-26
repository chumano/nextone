using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.Infrastructure
{
    public class DBBackup
    {
        public string Name { get; set; }
        public DateTime CreatedDate { get; set; }
        public long Size { get; set; }
    }

    public class DBBackupSchedule
    {
        public int BackupIntervalInDays { get; set; } = 1;
        public int KeepNumber { get; set; } = 5;
    }

    public class DBBackupOptions
    {
        public string Folder { get; set; }
    }

    public class DatabaseManager
    {
        private readonly IOptions<DBBackupOptions> _backupOptions;
        private readonly IHostEnvironment _environment;
        private readonly MasterDBContext _dbContext;
        private static bool _isBackingUp = false;
        public DatabaseManager(IOptions<DBBackupOptions> backupOptions,
            IHostEnvironment hostEnvironment,
            MasterDBContext masterDBContext)
        {
            _backupOptions = backupOptions;
            _environment = hostEnvironment;
            _dbContext = masterDBContext;
        }
        public async Task<IList<DBBackup>> GetBackups()
        {
            var dirPath = GetBackupFolderPath();
            var files = Directory.EnumerateFiles(dirPath, "*.bak");
            var backups = files.Select(filePath =>
            {
                var fileInfo =  new FileInfo(filePath);
                return new DBBackup()
                {
                    Name = fileInfo.Name,
                    CreatedDate = fileInfo.CreationTime,
                    Size = fileInfo.Length,
                };
            });
            return backups
                .OrderByDescending(o=>o.CreatedDate)
                .ToList();
        }

        public async Task Backup()
        {
            var now = DateTime.Now;
            if (_isBackingUp) throw new Exception("Dữ liệu đang được backup");
            _isBackingUp = true;
            var backupName = $"ucom-{now.ToString("dd-MM-yyyy-HH-mm-ss")}.bak";
            //var dirPath = GetBackupFolderPath();
            //mount /var/opt/mssql/data/backups
            //var filePath = Path.Combine(dirPath, backupName);
            string backupSQL = string.Format(@"BACKUP DATABASE [{0}] TO  DISK = N'{1}' WITH NOFORMAT, NOINIT,  NAME = N'UCOM-Full Database Backup', SKIP, NOREWIND, NOUNLOAD,  STATS = 10",
                    "NextOne", $"backups/{backupName}");
            var num = await _dbContext.Database.ExecuteSqlRawAsync(backupSQL);
            //await Task.Delay(10*1000);
            _isBackingUp = false;
        }

        public async Task DeletedOldBackup()
        {
            var dirPath = GetBackupFolderPath();

            var backupSchedule = await GetBackupSchedule();
            var files = Directory.EnumerateFiles(dirPath, "*.bak").ToList();
            if(files.Count > backupSchedule.KeepNumber)
            {
                //remove old
                var backups = files.Select(filePath =>
                {
                    var fileInfo = new FileInfo(filePath);
                    return fileInfo;
                }).OrderByDescending(o=>o.CreationTime);

                var olds = backups.Skip(backupSchedule.KeepNumber).ToList();
                foreach(var file in olds)
                {
                    File.Delete(file.FullName);
                }
            }
        }

        public async Task<DBBackupSchedule> GetBackupSchedule()
        {
            var systemSettings = await _dbContext.SystemSettings.FirstOrDefaultAsync(o => o.Code == "BackupSchedule");
            if(systemSettings == null)
            {
                return new DBBackupSchedule();
            }
            var data=  systemSettings.Data;
            try
            {
                var schedule = JsonConvert.DeserializeObject<DBBackupSchedule>(data);
                if(schedule == null)
                {
                    return new DBBackupSchedule();
                }
                return schedule;
            }catch(Exception ex)
            {
                return new DBBackupSchedule();
            }
        }

        public async Task UpdateBackupSchedule(DBBackupSchedule dBBackupSchedule)
        {
            var systemSettings = await _dbContext.SystemSettings.FirstOrDefaultAsync(o => o.Code == "BackupSchedule");

            var data = JsonConvert.SerializeObject(dBBackupSchedule);
            if(systemSettings == null)
            {
                _dbContext.SystemSettings.Add(new Domain.SystemSetting()
                {
                    Code = "BackupSchedule",
                    Name = "BackupSchedule",
                    Data = data
                });
            }
            else
            {
                systemSettings.Data = data;
            }

            await _dbContext.SaveChangesAsync();
        }

        private string GetBackupFolderPath()
        {
            var dirPath = _backupOptions.Value.Folder;// Path.Combine(_environment.ContentRootPath, _backupOptions.Value.Folder);
            return dirPath;
        }
    }
}
