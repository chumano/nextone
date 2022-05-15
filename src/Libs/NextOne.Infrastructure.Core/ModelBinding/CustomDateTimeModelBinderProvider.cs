using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NextOne.Infrastructure.Core.ModelBinding
{
    public class CustomDateTimeModelBinderProvider
        : IModelBinderProvider
    {
        public IModelBinder GetBinder(
            ModelBinderProviderContext context)
        {
            if (CustomDateTimeModelBinder
                .SUPPORTED_DATETIME_TYPES
                .Contains(context.Metadata.ModelType)
                )
            {
                return new BinderTypeModelBinder(
                    typeof(CustomDateTimeModelBinder));
            }
            return null;
        }
    }
}
