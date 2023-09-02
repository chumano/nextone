using System;

namespace ComService.Domain
{
    public class UserRelationship
    {
        public UserRelationship(string userId, string otherUserId)
        {
            UserId = userId;
            OtherUserId = otherUserId;
        }

        public void SetFriend(bool isFriend)
        {
            IsFriend = isFriend;
            if (isFriend)
            {
                FriendAt = DateTime.Now;
            }
        }

        public void SetBlock(bool isBlock)
        {
            IsFriend = isBlock;
            if (isBlock)
            {
                BlockedAt = DateTime.Now;
            }
        }

        public string UserId { get; private set; }
        public string OtherUserId { get; private set; }
        public bool IsBlock { get; private set; }
        public bool IsFriend { get; private set; }

        public DateTime? FriendAt { get; private set; }
        public DateTime? BlockedAt { get; private set; }

    }
}
