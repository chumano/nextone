using SharedDomain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Domain
{
    public class Message
    {
        private Message() //use for EFCore
        {
        }

        public Message(
            string id,
            MessageTypeEnum messageType,
            string userSenderId,
            string content, List<MessageFile> files)
        {
            Id = id;
            Type = messageType;
            UserSenderId = userSenderId;
            SentDate = DateTime.Now;
            Content = content;
            Files = files;
        }

        public Message(
            string id,
            MessageTypeEnum messageType,
            string userSenderId,
            Event evt)
        {
            Id = id;
            Type = messageType;
            UserSenderId = userSenderId;
            SentDate = DateTime.Now;
            Content = null;
            EventId = evt.Id;
            Event = evt;
        }

        public string Id { get; private set; }
        public string ConversationId { get; private set; }
        public MessageTypeEnum Type { get; private set; }

        public DateTime SentDate { get; private set; }
        public string UserSenderId { get; private set; }
        public UserStatus UserSender { get; private set; }

        public string Content { get; private set; }
        public List<MessageFile> Files { get; set; }

        public string EventId { get; private set; }
        public Event Event { get; private set; } 
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
        public string MessageId { get; private set; }
        public string FileId { get; set; }
        public FileTypeEnum FileType { get; set; }
        public string FileUrl { get; set; }
    }
}
