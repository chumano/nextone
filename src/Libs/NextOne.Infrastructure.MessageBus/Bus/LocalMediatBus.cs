using NextOne.Shared.Bus;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NextOne.Infrastructure.MessageBus.Bus
{
    public class LocalMediatBus : IBus
    {
        public LocalMediatBus()
        {

        }
        public Task Publish(IEvent domainEvent)
        {
            throw new NotImplementedException();
        }
    }
}
