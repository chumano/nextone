using MediatR;
using NextOne.Shared.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.Domain.DomainEvents
{
    public class UserCreated : IDomainEvent
    {
        public User User { get; private set; }
        public string CreatedBy { get; private set; }
        public UserCreated(User user, string createdBy)
        {
            User = user;
            CreatedBy = createdBy;
        }
    }
}
