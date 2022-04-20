using System;
using System.Data;

namespace MapService.Utils
{
    public static class DataRowHelper
    {
        public static int ToInt(this DataRow row, string col, int defaultvalue = 0)
        {
            return DBGetInt(row[col], defaultvalue);
        }

        public static double ToDouble(this DataRow row, string col, double defaultvalue = 0)
        {
            return DBGetDouble(row[col], defaultvalue);
        }

        public static bool ToBool(this DataRow row, string col, bool defaultvalue = false)
        {
            return DBGetBool(row[col], defaultvalue);
        }


        public static string ToString(this DataRow row, string col, string defaultvalue = "")
        {
            return DBGetString(row[col], defaultvalue);
        }

        public static DateTime ToDateTime(this DataRow row, string col, DateTime? defaultvalue = null)
        {
            return DBGetDatetime(row[col], defaultvalue);
        }



        public static int DBGetInt(object dbval, int defaultvalue = 0)
        {
            if (dbval == DBNull.Value) return defaultvalue;
            return Convert.ToInt32(dbval);
        }

        public static double DBGetDouble(object dbval, double defaultvalue = 0)
        {
            if (dbval == DBNull.Value) return defaultvalue;
            return Convert.ToDouble(dbval);
        }

        public static bool DBGetBool(object dbval, bool defaultvalue = false)
        {
            if (dbval == DBNull.Value) return defaultvalue;
            return Convert.ToBoolean(dbval);
        }

        public static string DBGetString(object dbval, string defaultvalue = "")
        {
            if (dbval == DBNull.Value) return defaultvalue;
            return Convert.ToString(dbval);
        }

        public static DateTime DBGetDatetime(object dbval, DateTime? defaultvalue = null)
        {
            if (dbval == DBNull.Value) return defaultvalue ?? DateTime.Now;
            return Convert.ToDateTime(dbval);
        }

    }

}
