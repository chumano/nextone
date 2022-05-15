using SharedDomain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileService.DTOs
{
    public class UploadFileResponse
    {
        public string FileId { get; set; }
        public string FileName { get; set; }
        public string FileUrl { get; set; }

        public string FileContent { get; set; }
        public FileTypeEnum FileType { get; set; }
    }
}
