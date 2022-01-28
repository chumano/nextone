using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Domain
{
    public class Channel
    {
       public string Id { get;  set;}
       public string Name { get; set; }
       public bool IsActive { get; set; }
       public bool IsDeleted { get; set; }

       public List<ChannelMember> Members { get; set; }
    }

    public enum MemberRoleEnum
    {
        MANAGER = 0,
        MEMBER = 1
    }

    public class ChannelMember
    {
        public string ChannelId { get; set; }
        public string UserId { get; set; }
        public MemberRoleEnum Role { get; set; }

        public UserStatus User { get; set; }
    }
}
