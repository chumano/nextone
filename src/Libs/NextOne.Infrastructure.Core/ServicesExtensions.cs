using Microsoft.Extensions.DependencyInjection;
using NextOne.Infrastructure.Core.Caching;
using System;

namespace NextOne.Infrastructure.Core
{
    public static class ServicesExtensions
    {
        public static IServiceCollection AddMemoryCacheStore(this IServiceCollection services)
        {
            services.AddMemoryCache();
            services.AddSingleton<ICacheStore, MemoryCacheStore>();
            return services;
        }
    }
}
