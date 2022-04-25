using System;
using System.Collections.Generic;
using System.Text;

namespace NextOne.Shared.Common
{
    public interface IdGenerator
    {
        string GenerateNew();
    }

    public class DefaultIdGenerator: IdGenerator
    {
        public string GenerateNew()
        {
            return Guid.NewGuid().ToString();
        }
    }
}
