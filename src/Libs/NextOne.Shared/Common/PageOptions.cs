using System;
using System.Collections.Generic;
using System.Text;

namespace NextOne.Shared.Common
{
    public class PageOptions
    {
        public PageOptions() {
            Offset = 0;
            PageSize = DefaultPageSize;
        }
        public PageOptions(int offset, int pageSize)
        {
            if (offset < 0) offset = 0;
            if (pageSize <= 0) pageSize = DefaultPageSize;
            Offset = offset;
            PageSize = pageSize;
        }
        public const int DefaultPageSize = 20;
        public int Offset { get; set; }
        public int PageSize { get; set; }
    }
}
