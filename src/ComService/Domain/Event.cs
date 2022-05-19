using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Domain
{
    public class Event
    {
        private Event() { }
        public Event(string id, 
            string content, 
            string eventCode,
            string userSenderId,
            DateTime dateTime,
            string address,
            double lat, double lon,
            List<EventFile> files)
        {
            Id = id;
            Content = content;
            EventTypeCode = eventCode;
            UserSenderId = userSenderId;
            OccurDate = dateTime;
            Address = address;
            Lat = lat;
            Lon = lon;
            Files = files;
            CreatedDate = DateTime.Now;
        }

        public string Id { get; private set; }
        public string Content { get; private set; }
        public string EventTypeCode { get; private set; }
        public DateTime OccurDate { get; private set; }
        public DateTime CreatedDate { get; private set; }

        public string Address { get; private set; }
        public double Lat { get; private set; }
        public double Lon { get; private set; }

        public string ChannelId { get; set; }
        public string UserSenderId { get; set; }
        public UserStatus UserSender { get; set; }

        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }

        public List<EventFile> Files { get; set; }
    }


  

    public class EventFile
    {
        public string EventId { get; set; }
        public string FileId { get; set; }
        public string FileType { get;  set; }
        public string FileUrl { get; set; }
    }


    public class EventResponse
    {
        public string EventResponseId { get; set; }
        public string EventId { get; set; }
        public string Content { get; set; }
        public string UserSenderId { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
