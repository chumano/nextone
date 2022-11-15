using ComService.Boudaries.Hubs;
using ComService.Domain.DomainEvents;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using System.Threading;
using System.Threading.Tasks;

namespace ComService.Boudaries.DomainEventHandlers
{
    public class ConversationMemberSeenHandler : INotificationHandler<ConversationMemberSeen>
    {
        private readonly IHubContext<ChatHub> _hubContext;
        public ConversationMemberSeenHandler(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task Handle(ConversationMemberSeen notification, CancellationToken cancellationToken)
        {
            var conversation = notification.Conversation;
            var userId = notification.UserId;

            //find users in conversation
            foreach (var user in conversation.Members)
            {
                //send to ohter clients of user
                if (user.UserId == userId) continue;

                await _hubContext.Clients.Groups($"user_{user.UserId}").SendAsync("data",
                    new HubEvent<ChatUserSeenEventData>
                    {
                        EventKey = "chat",
                        EventData = new ChatUserSeenEventData()
                        {
                            Data = userId
                        }
                    }, cancellationToken);
            }
        }
    }
}
