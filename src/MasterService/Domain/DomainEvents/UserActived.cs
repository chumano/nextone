using NextOne.Shared.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.Domain.DomainEvents
{
    public class UserActived : IDomainEvent
    {
        public User User { get; private set; }
        public bool IsActive { get; private set; }
        public string UpdatedBy { get; private set; }
        public UserActived(User user, string updatedBy)
        {
            User = user;
            IsActive = user.IsActive;
            UpdatedBy = updatedBy;
        }
    }
}
