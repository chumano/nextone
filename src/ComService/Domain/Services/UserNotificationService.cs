using ComService.Helpers;
using Microsoft.Extensions.Caching.Distributed;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
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
        private readonly ConcurrentDictionary<string, UserNotification> _notificationsDic;
        public UserNotificationService(IDistributedCache cache)
        {
            _cache = cache;
            _notificationsDic = new ConcurrentDictionary<string, UserNotification>();
        }

        public async Task AddNotification(string userId, string topicOrConversation,string title, string message)
        {
            var userConversationKey = GetCachedKey(userId, topicOrConversation);
            var userNotification = new UserNotification()
            {
                UserId = userId,
                TopicOrConversation = topicOrConversation,
                Title = title,
                Content = message
            };

            //TODO: store the notification
            //await _cache.SetAsync<UserNotification>(userConversationKey, userNotification);
            
            _notificationsDic.AddOrUpdate(userConversationKey,userNotification, (key, exist) =>
            {
                return userNotification;
            });
            
        }

        public async Task<IList<UserNotification>> GeNotifications()
        {
            var notifications = _notificationsDic.Values.ToList();
            return notifications;
        }

        public async Task RemoveNotification(string userId, string topicOrConversation)
        {
            var userConversationKey = GetCachedKey(userId, topicOrConversation);

            //remove from list
            //await _cache.RemoveAsync(key);
            _notificationsDic.Remove(userConversationKey, out var userNotification);
        }

        private string GetCachedKey(string userid, string topicOrConversation)
        {
            return $"CHAT_{userid}_{topicOrConversation}";
        }
    }
}
