using ComService.Boudaries.Hubs;
using ComService.Domain.DomainEvents;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using ComService.Domain.Services;

namespace ComService.Boudaries.DomainEventHandlers
{
    public class UserOnlineHandler : INotificationHandler<UserOnlineEvent>
    {
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly IServiceProvider _serviceProvider;
        public UserOnlineHandler(IHubContext<ChatHub> hubContext,
            IServiceProvider serviceProvider)
        {
            _hubContext = hubContext;
            _serviceProvider = serviceProvider;
        }
        public async Task Handle(UserOnlineEvent notification, CancellationToken cancellationToken)
        {
            //TODO: UserOnlineHandler check user really off 

            //save user status
            if (notification.IsOnline)
            {
                //using (var scope = _serviceProvider.CreateScope())
                //{
                //    var userService = scope.ServiceProvider.GetRequiredService<IUserStatusService>();
                //    await userService.AddOrUpdateUserStatus(notification.UserId, null, null);
                //}
            }
            else
            {
                //TODO: UserOnlineHandler set is offline
            }

            //send notify
            await _hubContext.Clients.All.SendAsync("data",
                  new HubEvent<UserEventData>
                  {
                      EventKey = "chat",
                      EventData = new UserEventData()
                      {
                          Data = new
                          {
                              UserId = notification.UserId,
                              IsOnline = notification.IsOnline,
                              UserName = notification.UserName,
                          }
                      }
                  }, cancellationToken);
           
        }
    }
}
