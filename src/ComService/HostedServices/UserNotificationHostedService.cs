using ComService.Domain.Services;
using ComService.Infrastructure;
using ComService.Infrastructure.AppSettings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NCrontab;
using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ComService.HostedServices
{
    public class UserNotificationHostedService : IHostedService
    {
        private CrontabSchedule _crontabSchedule;
        private DateTime _nextRun;
        private const string Schedule = "0 */1 * * * *"; // run day at each minute
        private readonly ILogger<UserNotificationHostedService> _logger;
        private readonly IServiceProvider _serviceProvider;
        private readonly ICloudService _cloudService;
        private bool _running = false;
        private readonly ConcurrentDictionary<string, DateTime> _lastSentNotfications;
        public UserNotificationHostedService(IServiceProvider serviceProvider,
             ICloudService cloudService,
            ILogger<UserNotificationHostedService> logger)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
            _cloudService = cloudService;
            _lastSentNotfications = new ConcurrentDictionary<string, DateTime>();
        }

        private async Task RunTask()
        {
            try
            {
                if (_running) return;
                _logger.LogInformation("UserNotificationHostedService RunTask...");
                //get 100 old token
                using var scopeService = _serviceProvider.CreateScope();

                var applicationOptions = scopeService.ServiceProvider.GetRequiredService<IOptionsMonitor<ApplicationOptions>>();

                var comDbContext = scopeService.ServiceProvider.GetRequiredService<ComDbContext>();
                var userNotificationService = scopeService.ServiceProvider.GetRequiredService<IUserNotificationService>();

                var oldDate = DateTime.Now.Subtract(TimeSpan.FromDays(1));
                var userNotifications = await userNotificationService.GeNotifications();

                foreach (var userNotification in userNotifications)
                {
                    try
                    {
                        //Todo: check last seen
                        var conversationMemberInfo = await comDbContext.ConversationMembers.AsNoTracking()
                                .Where(o => o.UserId == userNotification.UserId && o.ConversationId == userNotification.TopicOrConversation)
                                .FirstOrDefaultAsync();

                        if (conversationMemberInfo == null) continue;
                        if (conversationMemberInfo.SeenDate!=null && conversationMemberInfo.SeenDate > userNotification.CreatedDate)
                        {
                            continue;
                        }
                        var userConverationKey = $"SEND_{userNotification.UserId}_{userNotification.TopicOrConversation}";
                        var isSent = _lastSentNotfications.TryGetValue(userConverationKey, out var lastSent);

                        var isAllowSendNotification = true;
                        if (isSent)
                        {
                            var now = DateTime.Now;
                            int minutes = applicationOptions.CurrentValue.ReSendCloudMessageNotificationInMinutes;
                            //-------------LASTSENT-------->= minutes-------NOW
                            //[                  SEEN                     ]
                            if (now.Subtract(lastSent).TotalMilliseconds > minutes*60)
                            {
                                //đã lâu rồi chưa sent, giờ có notification mới thì send luôn
                            }
                            else
                            {
                                //----------------SEEN-----------LASTSENT
                                //Đã send rồi không cần send lại nữa, vì cái cũ user cũng chưa xem
                                if (conversationMemberInfo.SeenDate != null && conversationMemberInfo.SeenDate < lastSent)
                                {
                                    isAllowSendNotification = false;
                                }
                            }
                           
                        }

                        if (!isAllowSendNotification)
                        {
                            continue;
                        }

                        _logger.LogInformation($"UserNotificationHostedService SendCloudMessage[{applicationOptions.CurrentValue.SendCloudMessageNotificationEnabled}] to User {userNotification.UserId} : {userNotification.Content}");
                        _lastSentNotfications.AddOrUpdate(userConverationKey, DateTime.Now, (key, exist) => DateTime.Now);

                        if (applicationOptions.CurrentValue.SendCloudMessageNotificationEnabled)
                        {
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
                                        { "type",  "message" },
                                        { "conversationId" , userNotification.TopicOrConversation }
                                    }
                                };

                                await _cloudService.SendMessage(userTokens, cloudMessage);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"UserNotificationHostedService send to user {userNotification.UserId} Error: " + ex.Message);
                    }
                    finally
                    {
                        await userNotificationService.RemoveNotification(userNotification.UserId, userNotification.TopicOrConversation);
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
            _crontabSchedule = CrontabSchedule.Parse(Schedule, new CrontabSchedule.ParseOptions { IncludingSeconds = true });
            _nextRun = _crontabSchedule.GetNextOccurrence(DateTime.Now);
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
