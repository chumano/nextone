using NextOne.Shared.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Domain.DomainEvents
{
    public class ConversationMessageDeleted : IDomainEvent
    {
        public Conversation Conversation { get; set; }
        public Message Message { get; set; }
    }
}
