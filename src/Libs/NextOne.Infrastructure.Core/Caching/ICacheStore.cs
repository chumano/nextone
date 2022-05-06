using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace NextOne.Infrastructure.Core.Caching
{
    public interface ICacheStore
    {
        Task<T> Get<T> (string key );
        Task Set<T>(string key, T value);
        Task Remove<T>(string key, out T value);
    }

    public class MemoryCacheStore : ICacheStore
    {
        private readonly IMemoryCache _memoryCache;
        public MemoryCacheStore(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }
        public Task<T> Get<T>(string key)
        {
            if(!_memoryCache.TryGetValue<T>(key, out var value))
            {
                return Task.FromResult(default(T));
            }

            return Task.FromResult(value);
        }


        public Task Set<T>(string key, T value)
        {
            _memoryCache.Set<T>(key, value);
            return Task.CompletedTask;
        }


        public Task Remove<T>(string key, out T outValue)
        {
            outValue = default(T);
            if (_memoryCache.TryGetValue<T>(key, out var value))
            {
                outValue = value;
                _memoryCache.Remove(key);
            }

             return Task.CompletedTask;
        }
    }
}
