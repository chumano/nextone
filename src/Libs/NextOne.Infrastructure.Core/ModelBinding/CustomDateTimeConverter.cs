using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NextOne.Infrastructure.Core.ModelBinding
{
    public class CustomDateTimeConverter : DateTimeConverterBase
    {
        private readonly string dateFormat = null;
        private readonly DateTimeConverterBase innerConverter = null;

        public CustomDateTimeConverter()
            : this(dateFormat: null) { }

        public CustomDateTimeConverter(string dateFormat = null)
            : this(dateFormat, innerConverter: new IsoDateTimeConverter()) { }

        public CustomDateTimeConverter(string dateFormat = null, DateTimeConverterBase innerConverter = null)
        {
            this.dateFormat = dateFormat;
            this.innerConverter = innerConverter ?? new IsoDateTimeConverter();
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var isNullableType = IsNullableType(objectType);

            if (reader.TokenType == JsonToken.Null)
            {
                if (isNullableType)
                {
                    return null;
                }

                throw new JsonSerializationException($"Cannot convert null value to {objectType}.");
            }

            if (reader.TokenType == JsonToken.Date)
            {
                return (DateTime?)reader.Value;
            }

            if (reader.TokenType != JsonToken.String)
            {
                throw new JsonSerializationException($"Unexpected token parsing date. Expected {nameof(String)}, got {reader.TokenType}.");
            }

            var dateToParse = reader.Value.ToString();

            if (isNullableType && string.IsNullOrWhiteSpace(dateToParse))
            {
                return null;
            }

            if (string.IsNullOrEmpty(this.dateFormat))
            {
                return DateTimeHelper.ParseDateTime(dateToParse);
            }

            return DateTimeHelper.ParseDateTime(dateToParse, new string[] { this.dateFormat });
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        bool IsNullableType(Type type)
        {
            return type.IsGenericType && type.GetGenericTypeDefinition().Equals(typeof(Nullable<>));
        }
    }
}
