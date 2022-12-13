using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Domain
{
    public class PrivateConversation: Conversation
    {
        private PrivateConversation() { }
    }

    public class GroupConversation : Conversation
    {
        private GroupConversation() { }
    }

    public class P2PConversation : Conversation
    {
        private P2PConversation() { }
        public P2PConversation(string id,
            string name,
            ConversationTypeEnum conversationType) 
            :base(id, name, conversationType) {

        }
    }

    public abstract class Conversation
    {
        protected Conversation() //use for EFCore
        {
        }

        public Conversation(string id,
           string name,
           ConversationTypeEnum conversationType)
        {
            Id = id;
            Name = name;
            Type = conversationType;
            Members = new List<ConversationMember>();
            RecentMessages = new List<Message>();
            CreatedDate = DateTime.Now;
            UpdatedDate = DateTime.Now;
        }

        public string Id { get; protected set; }
        public string Name { get; protected set; }

        public ConversationTypeEnum Type { get; protected set; }
        public List<ConversationMember> Members { get; protected set; }
        public IList<Message> RecentMessages { get; protected set; }


        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }

        public void UpdateName(string name)
        {
            this.Name = name;
            UpdatedDate = DateTime.Now;
        }
        public void AddMember(ConversationMember member)
        {
            Members.Add(member);
            //UpdatedDate = DateTime.Now;
        }

        public void UpdateMemberRole(UserStatus user, MemberRoleEnum role)
        {
            var member = Members.Find(o => o.UserId == user.UserId);
            member.Role = role;
            UpdatedDate = DateTime.Now;
        }

        public void RemoveMember(UserStatus user)
        {
            var existMember = Members.Find(o => o.UserId == user.UserId);
            if(existMember != null)
            {
                Members.Remove(existMember);
                //UpdatedDate = DateTime.Now;
            }
        }

    }

    public class ConversationMember
    {
        public string ConversationId { get; set; }
        public string UserId { get; set; }

        public UserStatus UserMember { get; set; }
        public MemberRoleEnum Role { get; set; }

        public DateTime? SeenDate { get; set; }
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
        MEMBER = 1,
        PARENT = 2
    }
}
