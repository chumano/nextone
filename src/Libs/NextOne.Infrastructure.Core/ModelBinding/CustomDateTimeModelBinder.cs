using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextOne.Infrastructure.Core.ModelBinding
{
    public class CustomDateTimeModelBinder : IModelBinder
    {
        public static readonly Type[] SUPPORTED_DATETIME_TYPES =
            new Type[] { typeof(DateTime), typeof(DateTime?) };
        public Task BindModelAsync
            (ModelBindingContext modelBindingContext)
        {
            if (modelBindingContext == null)
            {
                throw new ArgumentNullException
                    (nameof(modelBindingContext));
            }
            if (!SUPPORTED_DATETIME_TYPES
                .Contains(modelBindingContext.ModelType)
                )
            {
                return Task.CompletedTask;
            }
            var modelName = modelBindingContext.ModelName;
            var valueProviderResult = modelBindingContext
                .ValueProvider
                .GetValue(modelName);
            if (valueProviderResult == ValueProviderResult.None)
            {
                return Task.CompletedTask;
            }
            modelBindingContext
                .ModelState
                .SetModelValue(modelName, valueProviderResult);
            var dateTimeToParse
                = valueProviderResult.FirstValue;
            if (string.IsNullOrEmpty(dateTimeToParse))
            {
                return Task.CompletedTask;
            }
            var formattedDateTime
                = DateTimeHelper.ParseDateTime(dateTimeToParse);
            modelBindingContext.Result
                = ModelBindingResult.Success(formattedDateTime);
            return Task.CompletedTask;
        }
       
    }
}
