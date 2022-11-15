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

    public class ChatUserSeenEventData : ChatEventData
    {
        public ChatUserSeenEventData()
        {
            ChatKey = "seen";
        }
        public string Data { get; set; }
    }

    public class UserEventData : ChatEventData
    {
        public UserEventData()
        {
            ChatKey = "user";
        }
        public object Data { get; set; }
    }

}
