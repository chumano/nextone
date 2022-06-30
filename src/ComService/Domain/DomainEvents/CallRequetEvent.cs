using NextOne.Shared.Domain;

namespace ComService.Domain.DomainEvents
{
    public class CallRequetEvent : IDomainEvent
    {
        public string ConversationId { get; set; }
        public string UserSenderId { get; set; }
        public string UserReceiverId { get; set; }

        public string CallType { get; set; }
    }
}
