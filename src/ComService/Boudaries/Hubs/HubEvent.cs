using ComService.Domain;

namespace ComService.Boudaries.Hubs
{
    public class HubEvent<T>
    {
        public string EventKey { get; set; }
        public T EventData { get; set; }
    }

    public abstract class ChatEvent
    {
        public string ChatKey { get; protected set; }
    }

    //============================================
    public class ChatMesageEvent : ChatEvent
    {
        public ChatMesageEvent()
        {
            ChatKey = "message";
        }
        public Message Data { get; set; }
    }

    //public class ChatMesageDeletedEvent : ChatEvent
    //{
    //    public ChatMesageDeletedEvent()
    //    {
    //        ChatKey = "messageDeleted";
    //    }
    //    public Message Data { get; set; }
    //}


    public class ChatUserSeenEvent : ChatEvent
    {
        public ChatUserSeenEvent()
        {
            ChatKey = "seen";
        }
        public ChatUserSeenEventData Data { get; set; }
    }

    public class ChatUserSeenEventData
    {
        public string ConversationId { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
    }

    //==============================================
    public class UserEvent : ChatEvent
    {
        public UserEvent()
        {
            ChatKey = "user";
        }
        public object Data { get; set; }
    }

}
