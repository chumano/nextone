using System;

namespace ComService.Domain
{
    public class UserDeviceToken
    {
        public string UserId { get; set; }
        public string Token { get; set; }
        public string OS { get; set; }

        public DateTime Date { get; set; }
    }
}
