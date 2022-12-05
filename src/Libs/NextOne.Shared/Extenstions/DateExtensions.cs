using System;
using System.Collections.Generic;
using System.Text;

namespace NextOne.Shared.Extenstions
{
    public static class DateExtensions
    {
        public static long ToUnixTimeStamp(this DateTime date)
        {
            return (long) date.ToUniversalTime().Subtract(new DateTime(1970, 1, 1)).TotalMilliseconds;
        }
    }
}
