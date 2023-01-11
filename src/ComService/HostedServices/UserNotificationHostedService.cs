using ComService.Domain.Services;
using ComService.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NCrontab;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ComService.HostedServices
{
    public class UserNotificationHostedService : IHostedService
    {
        private readonly CrontabSchedule _crontabSchedule;
        private DateTime _nextRun;
        private const string Schedule = "0 */1 * * * *"; // run day at each minute
        private readonly ILogger<UserNotificationHostedService> _logger;
        private readonly IServiceProvider _serviceProvider;
        private readonly ICloudService _cloudService;
        private bool _running = false;
        public UserNotificationHostedService(IServiceProvider serviceProvider,
             ICloudService cloudService,
            ILogger<UserNotificationHostedService> logger)
        {
            _crontabSchedule = CrontabSchedule.Parse(Schedule, new CrontabSchedule.ParseOptions { IncludingSeconds = true });
            _nextRun = _crontabSchedule.GetNextOccurrence(DateTime.Now);
            _logger = logger;
            _serviceProvider = serviceProvider;
            _cloudService = cloudService;
        }

        private async Task RunTask()
        {
            try
            {
                if (_running) return;
                _logger.LogInformation("UserNotificationHostedService RunTask...");
                //get 100 old token
                using var scopeService = _serviceProvider.CreateScope();

                var comDbContext = scopeService.ServiceProvider.GetRequiredService<ComDbContext>();
                var userNotificationService = scopeService.ServiceProvider.GetRequiredService<IUserNotificationService>();

                var oldDate = DateTime.Now.Subtract(TimeSpan.FromDays(1));
                var userNotifications = await userNotificationService.GeNotifications();

                foreach(var userNotification in userNotifications)
                {
                    try
                    {
                        //TODO: check last send to the user
                        var userTokens = await comDbContext.UserDeviceTokens.AsNoTracking()
                           .Where(o => o.UserId == userNotification.UserId)
                           .Select(o => o.Token)
                           .ToListAsync();

                        if (userTokens.Any())
                        {
                            var cloudMessage = new CloudMessage()
                            {
                                IsNotification = true,
                                Title = userNotification.Title,
                                Body = userNotification.Content,
                                Data = new System.Collections.Generic.Dictionary<string, string>
                                {
                                    { "topicOrConversation" , userNotification.TopicOrConversation }
                                }
                            };
                            await _cloudService.SendMessage(userTokens, cloudMessage);
                        }

                        await userNotificationService.RemoveNotification(userNotification.UserId, userNotification.TopicOrConversation);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"UserNotificationHostedService send to user {userNotification.UserId} Error: " + ex.Message);
                    }
                   
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UserNotificationHostedService Error: " + ex.Message);
            }
            finally
            {
                _running = false;
            }
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("UserNotificationHostedService running...");
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
