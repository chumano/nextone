using System;
using System.IO;
using System.Reflection;
using System.Text;

namespace ComService.Helpers
{
    public class EmbeddedResources
    {
        public static string GetFile(Assembly assembly, string namespaceAndFileName)
        {
            using (var stream = assembly.GetManifestResourceStream(namespaceAndFileName))
            using (var reader = new StreamReader(stream, Encoding.UTF8))
                return reader.ReadToEnd();
            
        }
    }
}
