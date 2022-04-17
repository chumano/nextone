using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Domain
{
    public class Event
    {
        public string Id { get; set; }
        public string Content { get; set; }
        public string EventTypeCode { get; set; }
        public DateTime OccurDate { get; set; }
        public DateTime CreatedDate { get; set; }

        public string Address { get; set; }
        public double Lat { get; set; }
        public double Lon { get; set; }

        public string ChannelId { get; set; }
        public string UserSenderId { get; set; }

        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }

        public EventType EventType { get; set; }
        public List<EventFile> Files { get; set; }
    }


    public class EventType
    {
        public string Code { get; set; }
        public string Name { get; set; }
    }

    public class EventFile
    {
        public string EventId { get; set; }
        public string FileId { get; set; }
        public string FileType { get;  set; }
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
