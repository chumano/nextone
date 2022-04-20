using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MapService.Wms
{
    public static class HttpRequestExtensions
    {
        public static string GetParam(this HttpRequest httpRequest, string param)
        {
            if (httpRequest.Query.ContainsKey(param))
            {
                return httpRequest.Query[param].ToString();
            }
            return null;
        }
    }
}
