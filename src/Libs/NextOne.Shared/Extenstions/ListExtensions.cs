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

        public static IEnumerable<List<T>> SplitList<T>(this List<T> locations, int nSize = 10)
        {
            for (int i = 0; i < locations.Count; i += nSize)
            {
                yield return locations.GetRange(i, Math.Min(nSize, locations.Count - i));
            }
        }
        
    }
}
