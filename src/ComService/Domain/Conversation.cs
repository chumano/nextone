using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Domain
{
    public class Conversation
    {
        private Conversation() //use for EFCore
        {
        }

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

        public IList<Message> RecentMessages { get; set; }

        public void AddMember(ConversationMember member)
        {
            Members.Add(member);
        }

        public void UpdateMemberRole(UserStatus user, MemberRoleEnum role)
        {
            var member = Members.Find(o => o.UserId == user.UserId);
            member.Role = role;
        }

        public void RemoveMember(UserStatus user)
        {
            var existMember = Members.Find(o => o.UserId == user.UserId);
            Members.Remove(existMember);
        }

    }

    public class ConversationMember
    {
        public string ConversationId { get; set; }
        public string UserId { get; set; }
        public UserStatus UserMember { get; set; }
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
