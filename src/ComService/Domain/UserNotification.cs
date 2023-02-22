using System;

namespace ComService.Domain
{
    public class UserNotification
    {
        public UserNotification()
        {
            CreatedDate = DateTime.Now;
        }

        public string UserId { get; set; }
        public string TopicOrConversation { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }

        public DateTime CreatedDate { get; private set; }
    }
}
