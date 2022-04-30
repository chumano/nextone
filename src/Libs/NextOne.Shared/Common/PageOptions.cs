using System;
using System.Collections.Generic;
using System.Text;

namespace NextOne.Shared.Common
{
    public class PageOptions
    {
        public const int DefaultPageSize = 20;
        public int Offset { get; set; }
        public int PageSize { get; set; }
    }
}
