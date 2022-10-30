﻿using NextOne.Shared.Domain;

namespace ComService.Domain.DomainEvents
{
    public class CloudCallRequetEvent : IDomainEvent
    {
        public string ConversationId { get; set; }
        public string UserSenderId { get; set; }
        public string UserReceiverId { get; set; }

        public string CallType { get; set; }
    }
}
