using NextOne.Shared.Domain;

namespace ComService.Domain.DomainEvents
{
    public class UserOnlineStatusEvent : IDomainEvent
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public bool IsOnline { get; set; }
    }

}
