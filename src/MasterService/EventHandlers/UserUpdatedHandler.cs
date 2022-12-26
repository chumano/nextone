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
    public class UserUpdatedHandler : INotificationHandler<UserUpdated>
    {
        private UserActivityService _userActivityService;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<UserUpdatedHandler> _logger;
        public UserUpdatedHandler(IServiceProvider serviceProvider, ILogger<UserUpdatedHandler> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }
        public async Task Handle(UserUpdated notification, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation($"{nameof(UserUpdatedHandler)} handle....");
                using var scoped = _serviceProvider.CreateScope();
                _userActivityService = scoped.ServiceProvider.GetService<UserActivityService>();
                await _userActivityService.AddUserActivity(notification.UpdatedBy, $"Cập nhật người dùng \"{notification.User.Name}\"", null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"{nameof(UserUpdatedHandler)} error : {ex.Message}");
            }

        }
    }
}
