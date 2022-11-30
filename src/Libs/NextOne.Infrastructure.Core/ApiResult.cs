using System;
using System.Collections.Generic;
using System.Text;

namespace NextOne.Infrastructure.Core
{
    public class ApiResult
    {
        public static ApiResult Success(object data)
        {
            return new ApiResult(data);
        }

        public static ApiResult Error(string errorMessage, object data = null)
        {
            return new ApiResult(errorMessage, data);
        }

        public ApiResult(object data){
            IsSuccess = true;
            Data = data;
        }

        public ApiResult(string errorMessage, object data =null)
        {
            IsSuccess = false;
            ErrorMessage = errorMessage;
            Data = data;
        }

        public bool IsSuccess { get; private set; }
        public object Data { get;  private set; }
        public string ErrorMessage { get; private set; }
    }
}
