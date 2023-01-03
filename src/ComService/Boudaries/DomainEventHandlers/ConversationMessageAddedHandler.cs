using ComService.Boudaries.Hubs;
using ComService.Domain;
using ComService.Domain.DomainEvents;
using ComService.Domain.Services;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using System.Threading;
using System.Threading.Tasks;

namespace ComService.Boudaries.DomainEventHandlers
{
    public class ConversationMessageAddedHandler : INotificationHandler<ConversationMessageAdded>
    {
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly IUserNotificationService _userNotificationService;
        public ConversationMessageAddedHandler(IHubContext<ChatHub> hubContext, IUserNotificationService userNotificationService)
        {
            _hubContext = hubContext;
            _userNotificationService = userNotificationService;
        }
        public async Task Handle(ConversationMessageAdded notification, CancellationToken cancellationToken)
        {
            var conversation = notification.Conversation;
            var message = notification.Message;

            //find users in conversation
            foreach( var user in conversation.Members)
            {
                //send to clients of user 
                await _hubContext.Clients.Groups($"user_{user.UserId}").SendAsync("data", 
                    new HubEvent<ChatMesageEvent>
                    {
                        EventKey = "chat",
                        EventData = new ChatMesageEvent()
                        {
                            Data = message
                        }
                    }, cancellationToken);

                if(message.UserSenderId!= user.UserId)
                {
                    await _userNotificationService.AddNotification(user.UserId, conversation.Id, "Có tin nhắn", $"Từ {message.UserSender.UserName}");
                }
            }
        }
    }
}
