using ComService.Boudaries.Hubs;
using ComService.Domain;
using ComService.Domain.DomainEvents;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using System.Threading;
using System.Threading.Tasks;

namespace ComService.Boudaries.DomainEventHandlers
{
    public class ConversationMessageAddedHandler : INotificationHandler<ConversationMessageAdded>
    {
        private readonly IHubContext<ChatHub> _hubContext;
        public ConversationMessageAddedHandler(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }
        public async Task Handle(ConversationMessageAdded notification, CancellationToken cancellationToken)
        {
            var conversation = notification.Conversation;
            var message = notification.Message;

            //find users in conversation
            foreach( var user in conversation.Members)
            {
                //sebd to clients of user 
                await _hubContext.Clients.Groups($"user_{user.UserId}").SendAsync("data", 
                    new HubEvent<ChatMesageEventData>
                    {
                        EventKey = "chat",
                        EventData = new ChatMesageEventData()
                        {
                            Data = message
                        }
                    }, cancellationToken);
            }
        }
    }
}
