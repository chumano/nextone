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
    public class UserDeletedHandler : INotificationHandler<UserDeleted>
    {
        private UserActivityService _userActivityService;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<UserDeletedHandler> _logger;
        public UserDeletedHandler(IServiceProvider serviceProvider, ILogger<UserDeletedHandler> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }
        public async Task Handle(UserDeleted notification, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation($"{nameof(UserDeletedHandler)} handle....");
                using var scoped = _serviceProvider.CreateScope();
                _userActivityService = scoped.ServiceProvider.GetService<UserActivityService>();
                await _userActivityService.AddUserActivity(notification.DeletedBy, $"Xóa người dùng \"{notification.User.Name}\"", null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"{nameof(UserDeletedHandler)} error : {ex.Message}");
            }

        }
    }
}
