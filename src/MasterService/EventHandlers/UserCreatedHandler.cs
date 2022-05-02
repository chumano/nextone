using MasterService.Domain.DomainEvents;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace MasterService.EventHandlers
{
    public class UserCreatedHandler : INotificationHandler<UserCreated>
    {
        private readonly ILogger<UserCreatedHandler> _logger;
        public UserCreatedHandler(ILogger<UserCreatedHandler> logger)
        {
            _logger = logger;
        }
        public async Task Handle(UserCreated notification, CancellationToken cancellationToken)
        {

            _logger.LogDebug("UserCreatedHandler...");
        }
    }
}
