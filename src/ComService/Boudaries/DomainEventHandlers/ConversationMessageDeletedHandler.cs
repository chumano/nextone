using ComService.Boudaries.Hubs;
using ComService.Domain.DomainEvents;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using System.Threading;
using System.Threading.Tasks;

namespace ComService.Boudaries.DomainEventHandlers
{
    public class ConversationMessageDeletedHandler : INotificationHandler<ConversationMessageDeleted>
    {
        private readonly IHubContext<ChatHub> _hubContext;
        public ConversationMessageDeletedHandler(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }
        public async Task Handle(ConversationMessageDeleted notification, CancellationToken cancellationToken)
        {
            var conversation = notification.Conversation;
            var message = notification.Message;

            //find users in conversation
            foreach (var user in conversation.Members)
            {
                //sebd to clients of user 
                await _hubContext.Clients.Groups($"user_{user.UserId}").SendAsync("data",
                    new HubEvent<ChatMesageEvent>
                    {
                        EventKey = "chat",
                        EventData = new ChatMesageEvent()
                        {
                            Data = message
                        }
                    }, cancellationToken);
            }
        }
    }
}
