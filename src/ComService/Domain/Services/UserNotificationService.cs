using ComService.Helpers;
using Microsoft.Extensions.Caching.Distributed;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ComService.Domain.Services
{
    public interface IUserNotificationService
    {
        Task AddNotification(string userId, string topicOrConversation, string title, string message);
        Task<IList<UserNotification>> GeNotifications();
        Task RemoveNotification(string userId, string topicOrConversation);
    }
    public class UserNotificationService : IUserNotificationService
    {
        private readonly IDistributedCache _cache;
        public UserNotificationService(IDistributedCache cache)
        {
            _cache = cache;
        }

        public async Task AddNotification(string userId, string topicOrConversation,string title, string message)
        {
            var key = GetCachedKey(userId, topicOrConversation);
            var userNotification = new UserNotification()
            {
                UserId = userId,
                TopicOrConversation = topicOrConversation,
                Title = title,
                Content = message
            };

            //TODO: add to list
            await _cache.SetAsync<UserNotification>(key, userNotification);
        }

        public Task<IList<UserNotification>> GeNotifications()
        {
            //TODO: get from list
            throw new System.NotImplementedException();
        }

        public async Task RemoveNotification(string userId, string topicOrConversation)
        {
            var key = GetCachedKey(userId, topicOrConversation);

            //TODO: remove from list
            await _cache.RemoveAsync(key);
        }

        private string GetCachedKey(string userid, string topicOrConversation)
        {
            return $"CHAT_{userid}_{topicOrConversation}";
        }
    }
}
