using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace NextOne.Infrastructure.Core.ModelBinding
{
    internal class DateTimeHelper
    {
        public static string[] CUSTOM_DATETIME_FORMATS = new string[]
            {
            "HH:mm:ss dd/MM/yyyy",
            "dd/MM/yyyy HH:mm:ss",
            "ddMMyyyy",
            "dd-MM-yyyy-THH-mm-ss",
            "dd-MM-yyyy-HH-mm-ss",
            "dd-MM-yyyy-HH-mm",

            };
        public static DateTime? ParseDateTime(string date, string[] formats = null)
        {
            if(formats == null || formats.Length ==0)
            {
                formats = CUSTOM_DATETIME_FORMATS;
            }

            foreach (var format in formats)
            {
                if (DateTime.TryParseExact(  date, format, null,  DateTimeStyles.None,
                    out DateTime validDate)
                   )
                {
                    return validDate;
                }
            }
            return null;
        }
    }
}
