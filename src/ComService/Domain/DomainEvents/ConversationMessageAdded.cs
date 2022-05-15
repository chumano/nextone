using NextOne.Shared.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Domain.DomainEvents
{
    public class ConversationMessageAdded : IDomainEvent
    {
        public Conversation Conversation { get; set; }
        public Message Message { get; set; }
    }
}
