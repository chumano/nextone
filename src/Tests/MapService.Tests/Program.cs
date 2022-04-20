using Newtonsoft.Json;
using SharpMap.Styles;
using System;
using System.IO;
namespace MapService.Tests
{
    internal class Program
    {
        private static string Folder = "Files";
        static void Main(string[] args)
        {
            Directory.CreateDirectory(Folder);

            Console.WriteLine("Hello World!");

            var vectorStyle = new VectorStyle();
            vectorStyle.Enabled = true;

            var settings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented,
                NullValueHandling = NullValueHandling.Ignore,
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                PreserveReferencesHandling = PreserveReferencesHandling.Arrays
            };
            string jsonString = JsonConvert.SerializeObject(vectorStyle, settings);
            Console.WriteLine(jsonString);
            string filename = "VectorStyle.json";
            var path = Path.Combine(Folder, filename);
            File.WriteAllText(path, jsonString);
        }
        public static void WriteXML<T>(T obj, string filename)
        {
            System.Xml.Serialization.XmlSerializer writer = new System.Xml.Serialization.XmlSerializer(typeof(T));

            var path = Path.Combine(Folder, filename);
            System.IO.FileStream file = System.IO.File.Create(path);

            writer.Serialize(file, obj);
            file.Close();
        }

        public static T ReadXML<T>(string filename)
        {
            var path = Path.Combine(Folder, filename);
            System.Xml.Serialization.XmlSerializer reader = new System.Xml.Serialization.XmlSerializer(typeof(T));
            System.IO.StreamReader file = new System.IO.StreamReader(path);
            var obj = (T)reader.Deserialize(file);
            file.Close();

            return obj;
        }

    }
}
