using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileService.Domain
{
    public class FileInfo
    {
        public string Id { get; set; }

        public string FileName { get; set; }
        public string RelativePath { get; set; }

        public string FileType { get; set; }

        public string SystemFeature { get; set; }

        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }

    }
}
