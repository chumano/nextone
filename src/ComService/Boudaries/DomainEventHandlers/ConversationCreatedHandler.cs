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
    public class ConversationCreatedHandler : INotificationHandler<ConversationCreated>
    {
        private UserActivityService _userActivityService;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<ConversationCreatedHandler> _logger;
        public ConversationCreatedHandler(IServiceProvider serviceProvider, ILogger<ConversationCreatedHandler> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }
        public async Task Handle(ConversationCreated notification, CancellationToken cancellationToken)
        {
            _logger.LogInformation($"{nameof(ConversationCreatedHandler)} handle....");
            if(notification.Conversation.Type == Domain.ConversationTypeEnum.Channel)
            {
                using var scoped = _serviceProvider.CreateScope();
                _userActivityService = scoped.ServiceProvider.GetService<UserActivityService>();
                await _userActivityService.AddUserActivity(notification.UserId, $"Tạo kênh \"{notification.Conversation.Name}\"", null);
            }
        }
    }
}
