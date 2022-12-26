using NextOne.Shared.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.Domain.DomainEvents
{
    public class UserUpdated : IDomainEvent
    {
        public User User { get; private set; }
        public string UpdatedBy { get; private set; }
        public UserUpdated(User user, string updatedBy)
        {
            User = user;
            UpdatedBy = updatedBy;
        }
    }
}
