using MasterService.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NCrontab;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace MasterService.HostedServices
{
    public class DatabaseBackupHostedService: IHostedService
    {

        private readonly CrontabSchedule _crontabSchedule;
        private DateTime _nextRun;
        private const string Schedule = "0 0 0 * * *"; // run day at 0 am
        private const string Schedule1 = "0 */1 * * * *"; // run day at each minute
        private readonly ILogger<DatabaseBackupHostedService> _logger;
        private readonly IServiceProvider _serviceProvider;
        private DateTime? _lastRun;
        public DatabaseBackupHostedService(IServiceProvider serviceProvider,
            ILogger<DatabaseBackupHostedService> logger)
        {
            _crontabSchedule = CrontabSchedule.Parse(Schedule, new CrontabSchedule.ParseOptions { IncludingSeconds = true });
            _nextRun = _crontabSchedule.GetNextOccurrence(DateTime.Now);
            _logger = logger;
            _serviceProvider = serviceProvider;
        }
        private async Task RunTask()
        {
            try
            {
                _logger.LogInformation("DatabaseBackupHostedService RunTask...");
                var now=DateTime.Now;
               
                using var scopeService = _serviceProvider.CreateScope();
                var dbManager = scopeService.ServiceProvider.GetRequiredService<DatabaseManager>();

                if (_lastRun != null)
                {
                    var backupSchedule = await dbManager.GetBackupSchedule();
                    if (now.Subtract(_lastRun.Value) < TimeSpan.FromDays(backupSchedule.BackupIntervalInDays))
                    {
                        return;
                    }
                }
                _logger.LogInformation("DatabaseBackupHostedService Run backup...");
                await dbManager.Backup();

                await dbManager.DeletedOldBackup();

                _lastRun = now;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CheckValidFCMHostedService Error: " + ex.Message);
            }
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("DatabaseBackupHostedService running...");
            Task.Run(async () =>
            {
                while (!cancellationToken.IsCancellationRequested)
                {
                    var waitTime = UntilNextExecution();
                    await Task.Delay(waitTime, cancellationToken); // wait until next time

                    await RunTask();

                    _nextRun = _crontabSchedule.GetNextOccurrence(DateTime.Now);
                }
            }, cancellationToken);

            return Task.CompletedTask;
        }

        private int UntilNextExecution() => Math.Max(0, (int)_nextRun.Subtract(DateTime.Now).TotalMilliseconds);

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}
