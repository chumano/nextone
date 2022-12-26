using NextOne.Shared.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.Domain.DomainEvents
{
    public class UserDeleted : IDomainEvent
    {
        public User User { get; private set; }
        public string DeletedBy { get; private set; }
        public UserDeleted(User user, string deletedBy)
        {
            User = user;
            DeletedBy = deletedBy;
        }
    }
}
