using ComService.Domain.DomainEvents;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using UserDomain;

namespace ComService.Boudaries.DomainEventHandlers
{
    public class ConversationDeletedHandler : INotificationHandler<ConversationDeleted>
    {
        private UserActivityService _userActivityService;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<ConversationDeletedHandler> _logger;
        public ConversationDeletedHandler(IServiceProvider serviceProvider, ILogger<ConversationDeletedHandler> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }
        public async Task Handle(ConversationDeleted notification, CancellationToken cancellationToken)
        {
            _logger.LogInformation($"{nameof(ConversationDeletedHandler)} handle....");
            using var scoped = _serviceProvider.CreateScope();
            _userActivityService = scoped.ServiceProvider.GetService<UserActivityService>();
            await _userActivityService.AddUserActivity(notification.UserId, $"Xóa kênh \"{notification.Conversation.Name}\"", null);
        }
    }
}
