using ComService.Domain.DomainEvents;
using ComService.Domain.Services;
using ComService.Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ComService.Boudaries.DomainEventHandlers
{
    public class CallRequetEventHandler : INotificationHandler<CallRequetEvent>
    {
        private readonly ILogger<CallRequetEventHandler> _logger;
        private readonly ICloudService _cloudService;
        private readonly IServiceProvider _serviceProvider;
        public CallRequetEventHandler(ILogger<CallRequetEventHandler>  logger, ICloudService cloudService, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _cloudService = cloudService;
            _serviceProvider = serviceProvider;
        }

        public async Task Handle(CallRequetEvent notification, CancellationToken cancellationToken)
        {
            try
            {
                var userSenderID = notification.UserSenderId;
                var userReceiverId = notification.UserReceiverId;
                using (var scope = _serviceProvider.CreateScope())
                {
                    var comDbContext = scope.ServiceProvider.GetService<ComDbContext>();
                    var userStatusService = scope.ServiceProvider.GetService<IUserStatusService>();

                    var senderUser = await userStatusService.GetUser(userSenderID);

                    var userTokens = await comDbContext.UserDeviceTokens.AsNoTracking()
                            .Where(o => o.UserId == userReceiverId)
                            .Select(o => o.Token)
                            .ToListAsync();

                    var message = new CloudMessage()
                    {
                        IsNotification = false,
                        Title = "Call Request",
                        Body = "Có cuộc gọi",
                        Data = new System.Collections.Generic.Dictionary<string, string>
                        {
                            { "type",  "call" },
                            { "conversationId" , notification.ConversationId },
                            { "senderId" , senderUser.UserId },
                            { "senderName" , senderUser.UserName },
                            { "callType", notification.CallType }
                            
                        }
                    };

                    _logger.LogInformation("_cloudService.SendMessage : " + string.Join(",", userTokens)
                        + "." + JsonConvert.SerializeObject(message));
                    await _cloudService.SendMessage(userTokens, message);
                }
            }catch(Exception ex)
            {
                _logger.LogError(ex, "[CallRequetEventHandler] " + ex.Message);
            }
        }
    }
}
