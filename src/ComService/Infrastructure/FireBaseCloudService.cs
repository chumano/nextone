using ComService.Domain.Services;
using FirebaseAdmin.Messaging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using NextOne.Shared.Extenstions;

namespace ComService.Infrastructure
{
    public class FireBaseCloudService : ICloudService
    {
        private readonly FireBaseClient _client;
        public FireBaseCloudService(FireBaseClient fireBaseClient)
        {
            _client = fireBaseClient;
        }


        public Task SendMessage(IList<string> listToken, CloudMessage message)
        {
            var fbMessage = ToFBMessage(message);
            return _client.SendMessage(listToken, fbMessage);
        }

        public Task SubscribeToken(string token)
        {
            return _client.SubscribeTokens(new List<string>() { token }, "chat");
        }

        public Task UnsubscribeToken(string token)
        {
            return _client.UnsubscribeTokens(new List<string>() { token }, "chat");
        }

        private MulticastMessage ToFBMessage(CloudMessage message)
        {
            var fbmessage = new MulticastMessage()
            {
                Data = message.Data,
                Notification = message.IsNotification? new Notification()
                    {
                        Title = message.Title,
                        Body = message.Body
                    }: null ,
                
            };

            var now = DateTime.UtcNow;
            var timeToLive = System.TimeSpan.FromSeconds(5);

            var expiration = now.ToUnixTimeStamp() + (long)timeToLive.TotalMilliseconds;
            //if (message.IsNotification)
            {
                fbmessage.Android = new AndroidConfig()
                {
                    Priority = Priority.High,
                    TimeToLive = timeToLive,
                    Notification = message.IsNotification? new AndroidNotification()
                    {
                        NotificationCount = 0,
                        ClickAction = "FLUTTER_NOTIFICATION_CLICK",
                    }: null
                };

                //https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/CommunicatingwithAPNs.html#//apple_ref/doc/uid/TP40008194-CH11-SW1
                //https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/sending_notification_requests_to_apns
                fbmessage.Apns = new ApnsConfig()
                {
                    Headers = new Dictionary<string, string>()
                    {
                        {"apns-expiration", (expiration/1000).ToString() },
                        {"apns-priority","5" },
                        {"apns-push-type","background"} ,
                        {"apns-topic", "org.reactjs.native.example.UCom.2022" }, // your app bundle identifier
                    },
                    Aps = new Aps()
                    {
                        Badge = message.IsNotification ? 1 : 1,
                        Sound = "default",
                        Category = "NEW_MESSAGE_CATEGORY",
                        ContentAvailable = true,
                    }
                };
            }

            return fbmessage;
        }
    }
}
