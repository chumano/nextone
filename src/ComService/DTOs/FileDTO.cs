using SharedDomain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.DTOs
{
    public class FileDTO
    {
      
        public string FileId { get; set; }
        public FileTypeEnum FileType { get; set; }

        public string FileUrl { get; set; }
    }

}
