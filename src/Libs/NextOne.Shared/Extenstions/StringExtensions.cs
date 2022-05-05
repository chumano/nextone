using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

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

        public static string UrlEncodeBase64String(this string value)
        {
            var valueBytes = Encoding.UTF8.GetBytes(value);
            return HttpUtility.UrlEncode(Convert.ToBase64String(valueBytes));
        }

        public static string UrlDecodeBase64String(this string value)
        {
            var valueDecodedUrl = HttpUtility.UrlDecode(value);
            var valueBytes = System.Convert.FromBase64String(valueDecodedUrl);
            return Encoding.UTF8.GetString(valueBytes);
        }

        public  static string ToOnlyAlphaNumbericChars(this string value)
        {
            Regex rgx = new Regex("[^a-zA-Z0-9 -]");
            value = rgx.Replace(value, "");
            return value;
        }

        public static string ToSafeFileName(this string value)
        {
            foreach (var c in Path.GetInvalidFileNameChars())
            {
                value = value.Replace(c, '_');
            }

            return value;
        }
    }
}
