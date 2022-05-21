using ComService.Domain;
using Newtonsoft.Json;
using NextOne.Infrastructure.Core.ModelBinding;
using SharedDomain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.DTOs.Event
{
    public class SendEventDTO
    {
        public string Content { get; set; }
        public string EventTypeCode { get; set; }

        [JsonConverter(typeof(CustomDateTimeConverter), null)]
        public DateTime OccurDate { get; set; }

        public string Address { get; set; }
        public double Lat { get; set; }
        public double Lon { get; set; }

        public List<SendEventFileDTO> Files { get; set; }
    }

    public class SendEventFileDTO
    {
        public string FileId { get; set; }
        public FileTypeEnum FileType { get; set; }
        public string FileName { get; set; }
        public string FileUrl { get; set; }
    }
}
