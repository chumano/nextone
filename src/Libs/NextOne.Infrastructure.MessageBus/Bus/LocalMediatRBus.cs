using MediatR;
using NextOne.Shared.Bus;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NextOne.Infrastructure.MessageBus.Bus
{
    public class LocalMediatRBus : IBus
    {
        private readonly IMediator _mediator;
        public LocalMediatRBus(IMediator mediator)
        {
            _mediator = mediator;
        }
        public async Task Publish(IEvent evt)
        {
            await _mediator.Publish(evt);
        }
    }

    public class EventNotification : MediatR.INotification
    {
        public EventNotification(IEvent evt)
        {
            Event = evt;
        }

        public IEvent Event { get; }
    }
}
