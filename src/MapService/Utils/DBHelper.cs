using System.Data;
using System.Data.SqlClient;

namespace MapService.Utils
{
    public class DBHelper
    {
        public static string ConnectionString;
        public static DataTable GetDataTable(string query)
        {
            DataTable tbl = null;
            using (SqlConnection sqlConn = new SqlConnection(ConnectionString))
            {
                tbl = GetDataTable(sqlConn, query);
            }

            return tbl;
        }
        public static DataTable GetDataTable(SqlConnection sqlConn, string query)
        {
            //SqlConnection sqlConn = (SqlConnection)dbFactory.GetContext().Database.Connection;
            SqlCommand cmdReport = new SqlCommand(query, sqlConn);
            SqlDataAdapter daReport = new SqlDataAdapter();
            daReport.SelectCommand = cmdReport;
            DataSet retVal = new DataSet();
            using (cmdReport)
            {
                cmdReport.CommandType = CommandType.Text;
                daReport.Fill(retVal);
            }
            return retVal.Tables[0];
        }

    }
}
