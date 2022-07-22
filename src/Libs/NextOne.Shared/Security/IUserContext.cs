using System;
using System.Collections.Generic;
using System.Text;

namespace NextOne.Shared.Security
{
    public interface IUserContext
    {
        bool IsAuthenticated { get; }
        IUser User { get; }

        IList<string> UserRoles { get; }

        bool IsAdmin { get; }

        string IpAddress { get; }
    }
}
