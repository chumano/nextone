using MapService.Domain.Repositories;
using MapService.Infrastructure.AppSettings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NextOne.Infrastructure.Core.Caching;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace MapService.BackgroundServices
{
    public class MapWatcherBackgroundService : IHostedService
    {
        private readonly ILogger<MapWatcherBackgroundService> _logger;
        private readonly IServiceProvider _serviceProvider;
        private readonly IOptionsMonitor<MapSettings> _optionsMonitor;

        private int executionCount = 0;
        private int _lastMapWatcherIntervalInMinutes = 0;
        private Timer _timer = null!;
        public MapWatcherBackgroundService(
            ILogger<MapWatcherBackgroundService> logger,
            IServiceProvider services,
            IOptionsMonitor<MapSettings> optionsMonitor)
        {
            _logger = logger;
            _serviceProvider = services;
            _optionsMonitor = optionsMonitor;
        }
      
        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(DoWork, null, TimeSpan.Zero, 
                TimeSpan.FromMinutes(_optionsMonitor.CurrentValue.MapWatcherIntervalInMinutes));
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

                foreach(var mapInfo in maps)
                {
                    //get map tiles folder 
                    var mapTilesFolder = Path.Combine(_optionsMonitor.CurrentValue.MapTilesFolder, mapInfo.Id);
                    if (!Directory.Exists(mapTilesFolder))
                    {
                        continue;
                    }

                    //get older version folder
                    var folderPaths = Directory.EnumerateDirectories(mapTilesFolder);
                    foreach(var folderPath in folderPaths)
                    {
                        string folderNameInVersion = new DirectoryInfo(folderPath).Name;
                        if(folderNameInVersion!= mapInfo.Version.ToString())
                        {
                            //delete folder
                            Directory.Delete(folderPath, true);
                        }
                    }
                }
            }

            if(_lastMapWatcherIntervalInMinutes!=0 && 
                _lastMapWatcherIntervalInMinutes != _optionsMonitor.CurrentValue.MapWatcherIntervalInMinutes)
            {
                ResetTimer();
            }
            _lastMapWatcherIntervalInMinutes = _optionsMonitor.CurrentValue.MapWatcherIntervalInMinutes;

        }

        private void ResetTimer()
        {
            _timer?.Dispose();
            _timer = new Timer(DoWork, null, 
                TimeSpan.FromMinutes(_optionsMonitor.CurrentValue.MapWatcherIntervalInMinutes), 
                TimeSpan.FromMinutes(_optionsMonitor.CurrentValue.MapWatcherIntervalInMinutes));
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Dispose();
            return Task.CompletedTask;
        }
    }
}
