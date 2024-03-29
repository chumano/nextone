﻿using MasterService.Domain.DomainEvents;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using UserDomain;

namespace MasterService.EventHandlers
{
    public class UserCreatedHandler : INotificationHandler<UserCreated>
    {
        private UserActivityService _userActivityService;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<UserCreatedHandler> _logger;
        public UserCreatedHandler(IServiceProvider serviceProvider, ILogger<UserCreatedHandler> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }
        public async Task Handle(UserCreated notification, CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation($"{nameof(UserCreatedHandler)} handle....");
                using var scoped = _serviceProvider.CreateScope();
                _userActivityService = scoped.ServiceProvider.GetService<UserActivityService>();
                await _userActivityService.AddUserActivity(notification.CreatedBy, $"Tạo người dùng \"{notification.User.Name}\"", null);
            }catch (Exception ex)
            {
                _logger.LogError(ex, $"{nameof(UserCreatedHandler)} error : {ex.Message}");
            }
           
        }
    }
}
