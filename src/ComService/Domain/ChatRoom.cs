using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Domain
{
    public class ChatRoom
    {
        public string Id { get; set; }
        public bool IsGroup { get; set; }
        public string Name { get; set; }

        public string LastMessage { get; set; }
        public DateTime? LastMessageSentDate { get; set; }

        public List<ChatRoomMember> Members { get; set; }
    }

    public class ChatRoomMember
    {
        public string ChatRoomId { get; set; }
        public string UserId { get; set; }
    }

    public class ChatMessage
    {
        public string Id { get; set; }
        public string ChatRoomId { get; set; }
        public string UserSenderId { get; set; }
        public string Message { get; set; }

        public DateTime SentDate { get; set; }

        public UserStatus User { get; set; }

        public List<ChatMessageFile> Files { get; set; }
    }

    public class ChatMessageFile
    {
        public string ChatMessageId { get; set; }
        public string FileId { get; set; }
        public string FileType { get; set; }
    }
}
