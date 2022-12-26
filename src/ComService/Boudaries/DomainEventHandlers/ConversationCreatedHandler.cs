using ComService.Domain.DomainEvents;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using UserDomain;

namespace ComService.Boudaries.DomainEventHandlers
{
    public class ConversationCreatedHandler : INotificationHandler<ConversationCreated>
    {
        private readonly UserActivityService _userActivityService;
        public ConversationCreatedHandler(UserActivityService userActivityService)
        {
            _userActivityService = userActivityService;
        }
        public async Task Handle(ConversationCreated notification, CancellationToken cancellationToken)
        {
            await _userActivityService.AddUserActivity("001", "ConversationCreated", null);
        }
    }
}
