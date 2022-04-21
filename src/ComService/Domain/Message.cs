using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Domain
{
    public class Message
    {
        public Message(MessageTypeEnum messageType)
        {
            Type = messageType;
        }

        public string Id { get; set; }
        public string ConversationId { get; set; }
        public MessageTypeEnum Type { get; set; }

        public DateTime SentDate { get; set; }
        public string UserSenderId { get; set; }
        public UserStatus UserSender { get; set; }

        public string Content { get; set; }
        public List<MessageFile> Files { get; set; }

        public string EventId { get; set; }
        public Event Event { get; set; } 
    }

    public enum MessageTypeEnum
    {
        Text, //single text
        ImageFile, // multi_file
        VideoFile, //single file
        OtherFile, //single file
        SystemMessage, // single text
        CallMessage,
        Event
    }

    public class MessageFile
    {
        public string MessageId { get; set; }
        public string FileId { get; set; }
        public string FileType { get; set; }
    }
}
