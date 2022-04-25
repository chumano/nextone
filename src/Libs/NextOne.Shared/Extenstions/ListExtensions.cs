using System;
using System.Collections.Generic;
using System.Text;

namespace NextOne.Shared.Extenstions
{
    public static  class ListExtensions
    {
        public static string ToDBString(this IList<string> list, string seprator=",")
        {
           //[abc,def] => ",abc,def,
            if (list == null) return null;
            var rs = string.Join(seprator, list);
            if (string.IsNullOrEmpty(rs)) return rs;
            return $"{seprator}{rs}{seprator}";
        }
    }
}
