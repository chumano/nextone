using ComService.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NCrontab;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ComService.HostedServices
{
    public class CheckValidFCMHostedService : IHostedService
    {
        private readonly CrontabSchedule _crontabSchedule;
        private DateTime _nextRun;
        private const string Schedule = "0 0 0 * * *"; // run day at 0 am
        private const string Schedule1 = "0 */1 * * * *"; // run day at each minute
        private readonly ILogger<CheckValidFCMHostedService> _logger;
        private readonly IServiceProvider _serviceProvider;
        public CheckValidFCMHostedService(IServiceProvider serviceProvider, ILogger<CheckValidFCMHostedService> logger)
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
                _logger.LogInformation("CheckValidFCMHostedService running...");
                //get 100 old token
                using var scopeService = _serviceProvider.CreateScope();

                var dbContext = scopeService.ServiceProvider.GetRequiredService<ComDbContext>();

                var oldDate = DateTime.Now.Subtract(TimeSpan.FromDays(1));
                var deviceTokens = await dbContext.UserDeviceTokens.AsNoTracking()
                    .Where(o=> o.Date < oldDate)
                    .OrderBy(o => o.Date)
                    .Take(100)
                    .ToListAsync();

                var fireBaseClient = _serviceProvider.GetService<FireBaseClient>();
                foreach (var userToken in deviceTokens)
                {
                    var token = userToken.Token;
                    var name = token.Substring(0, 10);
                    var result = "";
                    var isError = false;
                    try
                    {
                        result = await fireBaseClient.TestMessage(token);
                    }catch(Exception ex)
                    {
                        _logger.LogError(ex, "CheckValidFCMHostedService TestMessage: " + ex.Message);
                        result = "ERROR " + ex.Message;
                        if(ex.Message.Contains("Requested entity was not found"))
                        {
                            isError = true;
                        }
                    }
                    _logger.LogInformation($"{userToken.UserId}: " + result);
                    if (isError)
                    {
                        try
                        {
                            //dlete token
                            dbContext.UserDeviceTokens.Remove(userToken);
                            await dbContext.SaveChangesAsync();
                            _logger.LogInformation("Removed UserToken : " + JsonConvert.SerializeObject(userToken));
                        }
                        catch(Exception ex)
                        {
                            _logger.LogError(ex, "CheckValidFCMHostedService RemoveUserToken: " + ex.Message);
                        }
                    }
                }
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "CheckValidFCMHostedService Error: " + ex.Message);
            }
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
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
