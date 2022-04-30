using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NextOne.Shared.Bus
{
    public interface IBus
    {
        Task Publish(IEvent domainEvent);
    }
}
