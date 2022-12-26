using MasterService.Domain.DomainEvents;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using UserDomain;

namespace MasterService.EventHandlers
{
    public class UserActivedHandler : INotificationHandler<UserActived>
    {
        private UserActivityService _userActivityService;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<UserActivedHandler> _logger;
        public UserActivedHandler(IServiceProvider serviceProvider, ILogger<UserActivedHandler> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }
        public async Task Handle(UserActived notification, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation($"{nameof(UserActivedHandler)} handle....");
                using var scoped = _serviceProvider.CreateScope();
                _userActivityService = scoped.ServiceProvider.GetService<UserActivityService>();
                await _userActivityService.AddUserActivity(notification.UpdatedBy, $"{(notification.IsActive?"Kích hoạt": "Khóa")} người dùng \"{notification.User.Name}\"", null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"{nameof(UserActivedHandler)} error : {ex.Message}");
            }

        }
    }
}
