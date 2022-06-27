using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ComService.Domain.Services
{
    public class CloudMessage
    {
        public CloudMessage()
        {
            IsNotification = false;
        }
        public string Title { get; set; }
        public string Body { get; set; }
        public DateTime Date { get; set; }

        public bool IsNotification { get; set; }


        public string Type { get; set; }
        public Dictionary<string,string> Data { get; set; }
    }

    public interface ICloudService
    {
        Task SubscribeToken(string token);
        Task UnsubscribeToken(string token);

        Task SendMessage(IList<string> listToken, CloudMessage message);

    }
}
