using NextOne.Shared.Domain;

namespace ComService.Domain.DomainEvents
{
    public class UserOnlineEvent : IDomainEvent
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public bool IsOnline { get; set; }
    }

}
