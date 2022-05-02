using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace NextOne.Shared.Bus
{
    public interface IEvent : INotification
    {
    }
}
