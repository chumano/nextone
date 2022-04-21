using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileService.DTOs
{
    public class UploadFileResponse
    {
        public string FileName { get; set; }
        public string Url { get; set; }

        public string FileType { get; set; }
    }
}
