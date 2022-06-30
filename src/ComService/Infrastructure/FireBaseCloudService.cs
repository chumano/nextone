using ComService.Domain.Services;
using FirebaseAdmin.Messaging;
using System.Collections.Generic;
using System.Threading.Tasks;

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
                Android = new AndroidConfig()
                {
                    Priority = Priority.High,
                    Notification = new AndroidNotification()
                    {
                        ClickAction = "FLUTTER_NOTIFICATION_CLICK",
                    }
                },
                Apns = new ApnsConfig()
                {
                    Aps = new Aps()
                    {
                        Badge = 1,
                        Sound = "default",
                        Category = "NEW_MESSAGE_CATEGORY"
                    }
                }
            };

            return fbmessage;
        }
    }
}
