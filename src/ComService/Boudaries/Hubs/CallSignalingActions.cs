namespace ComService.Boudaries.Hubs
{
    public class CallSignalingActions
    {
        public const string SEND_CALL_REQUEST = "call-send-request";
        public const string SEND_CALL_REQUEST_RESPONSE = "call-send-request-response";

        public const string SEND_SESSION_DESCRIPTION = "call-send-session-description";
        public const string SEND_ICE_CANDIDATE = "call-send-ice-cadidate";
        public const string SEND_HANG_UP = "call-send-hangup";
    }


    public class CallRequestPayload
    {
        public string Room { get; set; }
    }

    public class CallRequestResponsePayload
    {
        public string Room { get; set; }
    }

}
