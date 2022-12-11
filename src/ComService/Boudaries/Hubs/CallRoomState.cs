using System;

namespace ComService.Boudaries.Hubs
{

    public enum CallStateEnum
    {
        Requesting,
        Calling,
        End
    }
    public class CallRoomState
    {
        public string ConversationId { get; set; }
        public CallStateEnum State { get; set; }
        public string SenderId { get; set; }
        public string SenderName { get; set; }
        public DateTime RequestDate { get; set; }

    }
}
