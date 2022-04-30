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

        public static ApiResult Error(string errorMessage)
        {
            return new ApiResult(errorMessage);
        }

        public ApiResult(object data){
            IsSuccess = true;
            Data = data;
        }

        public ApiResult(string errorMessage)
        {
            IsSuccess = false;
            ErrorMessage = errorMessage;
        }

        public bool IsSuccess { get; private set; }
        public object Data { get;  private set; }
        public string ErrorMessage { get; private set; }
    }
}
