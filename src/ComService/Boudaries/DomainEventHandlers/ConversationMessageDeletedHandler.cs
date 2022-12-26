using ComService.Boudaries.Hubs;
using ComService.Domain.DomainEvents;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ComService.Boudaries.DomainEventHandlers
{
    public class ConversationMessageDeletedHandler : INotificationHandler<ConversationMessageDeleted>
    {
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly ILogger<ConversationMessageDeletedHandler> _logger;
        public ConversationMessageDeletedHandler(IHubContext<ChatHub> hubContext, ILogger<ConversationMessageDeletedHandler> logger)
        {
            _hubContext = hubContext;
            _logger = logger;
        }
        public async Task Handle(ConversationMessageDeleted notification, CancellationToken cancellationToken)
        {
            try
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
            }catch(Exception ex)
            {
                _logger.LogError(ex,$"{nameof(ConversationMessageDeletedHandler)} error: {ex.Message}");
            }
           
        }
    }
}
