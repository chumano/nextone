using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Domain
{
    public class Conversation
    {
        public Conversation(ConversationTypeEnum conversationType)
        {
            Type = conversationType;
        }

        public string Id { get; set; }
        public string Name { get; set; }

        public ConversationTypeEnum Type { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }

        public List<ConversationMember> Members { get; set; }

        public string LastMessageId { get; set; }
        public Message LastMessage { get; set; }
        public IList<Message> RecentMessages { get; set; }
    }

    public class ConversationMember
    {
        public string ConversationId { get; set; }
        public string UserId { get; set; }
        public MemberRoleEnum Role { get; set; }

    }

    public enum ConversationTypeEnum
    {
        Private,
        Peer2Peer,
        Group,
        Channel
    }
    public enum MemberRoleEnum
    {
        MANAGER = 0,
        MEMBER = 1
    }
}
