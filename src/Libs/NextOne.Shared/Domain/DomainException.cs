using System;
using System.Collections.Generic;
using System.Text;

namespace NextOne.Shared.Domain
{
    public class DomainException : Exception
    {
        public DomainException(string key, string message)
            : base(message)
        {
            Key = key;
        }

        public string Key { get; set; }
    }
}
