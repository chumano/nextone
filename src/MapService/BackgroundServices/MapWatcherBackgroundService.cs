using MapService.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NextOne.Infrastructure.Core.Caching;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace MapService.BackgroundServices
{
    public class MapWatcherBackgroundService : IHostedService
    {
        private readonly ILogger<MapWatcherBackgroundService> _logger;
        private readonly IServiceProvider _serviceProvider;

        private int executionCount = 0;
        private Timer _timer = null!;
        public MapWatcherBackgroundService(
            ILogger<MapWatcherBackgroundService> logger,
            IServiceProvider services)
        {
            _logger = logger;
            _serviceProvider = services;
        }
      
        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromSeconds(60));
            return Task.CompletedTask;
        }

        private async void DoWork(object? state)
        {
            var count = Interlocked.Increment(ref executionCount);
            _logger.LogDebug("MapWatcherBackgroundService is working. Count: {Count}", count);
            using (var scope = _serviceProvider.CreateScope())
            {
                var mapRepository = scope.ServiceProvider.GetRequiredService<IMapRepository>();
                var cacheStore = scope.ServiceProvider.GetRequiredService<ICacheStore>();

                var maps = await mapRepository.Maps.ToListAsync();

                //TODO: find maps not use in recent to remove from cache
            }

        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Dispose();
            return Task.CompletedTask;
        }
    }
}
