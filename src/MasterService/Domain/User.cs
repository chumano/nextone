using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.Domain
{
    public class User
    {
        private User() { }

        public User(string id, string name, string email, string phone)
        {
            Id = id;
            Name = name;
            Email = email;
            Phone = phone;
            IsActive = true;
            IsDeleted = false;
            CreatedDate = DateTime.Now;
            UpdatedDate = DateTime.Now;
        }

        public string Id { get; private set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get;  set; }
        public List<UserRole> Roles { get; private set; }

        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }


        public void SetRoles(List<UserRole> userRoles)
        {
            Roles = userRoles;
        }
    }
}
