using NextOne.Shared.Domain;

namespace ComService.Domain.DomainEvents
{
    public class ConversationMemberSeen : IDomainEvent
    {
        public Conversation Conversation { get; private set; }
        public string UserId { get; private  set; }
        public ConversationMemberSeen(Conversation conversation, string userId)
        {
            Conversation = conversation;
            UserId = userId;
        }
    }
}
