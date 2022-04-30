using Microsoft.Extensions.Logging;
using NextOne.Shared.Domain;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NextOne.Shared.Bus
{
    public class LocalBus : IBus
    {
        private readonly ILogger<LocalBus> _logger;
        public LocalBus(ILogger<LocalBus> logger)
        {
            _logger = logger;
        }

        public Task Publish(IEvent evt)
        {
            _logger.LogDebug($"Pushlish {nameof(evt)}");
            return Task.CompletedTask;
        }
    }
}
