using ComService.Domain;

namespace ComService.Boudaries.Hubs
{
    public class HubEvent<T>
    {
        public string EventKey { get; set; }
        public T EventData { get; set; }
    }

    public abstract class ChatEventData
    {
        public string ChatKey { get; protected set; }
    }
    public class ChatMesageEventData : ChatEventData
    {
        public ChatMesageEventData()
        {
            ChatKey = "message";
        }
        public Message Data { get; set; }
    }
}
