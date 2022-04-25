using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NextOne.Shared.Extenstions
{
    public static  class StringExtensions
    {
        public static IList<string> ToListFromDBString(this string str, string seprator = ",")
        {
            //",abc,def, => [abc,def]
            if (string.IsNullOrWhiteSpace(str)) return null;

            var splitString = new String[] { seprator };
            var list = str.Split(splitString, StringSplitOptions.RemoveEmptyEntries);
            return list.ToList();
        }
    }
}
