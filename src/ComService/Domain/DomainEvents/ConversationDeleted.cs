using NextOne.Shared.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Domain.DomainEvents
{
    public class ConversationDeleted :IDomainEvent
    {
        public Conversation Conversation { get; private set; }
        public string UserId { get; private set; }
        public ConversationDeleted(Conversation conversation, string userId)
        {
            Conversation = conversation;
            UserId = userId;
        }
    }
}
