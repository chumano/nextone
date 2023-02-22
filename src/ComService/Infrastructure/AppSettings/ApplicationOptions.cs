using System.Collections.Generic;

namespace ComService.Infrastructure.AppSettings
{
    public class ApplicationOptions
    {
        public int MaxFindUserDistanceInMeters { get; set; }
        public int CallTimeOutInSeconds { get; set; }
        public int UpdateLocationHeartbeatInSeconds { get; set; }
        public List<IceServer> IceServers { get; set; }

        public bool SendCloudMessageNotificationEnabled { get; set; }
        public int ReSendCloudMessageNotificationInMinutes { get; set; } = 60;
    }
    public class IceServer
    {
        public List<string> urls { get; set; }
        public string username { get; set; }
        public string credential { get; set; }
    }

}
