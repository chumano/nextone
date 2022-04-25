using ICSharpCode.SharpZipLib.Zip;
using System;
using System.Collections.Generic;
using System.IO;

namespace MapService.Utils
{
    public class ZipHelper
    {
        public static void Zip(List<string> files, string zipfile)
        {
            if (File.Exists(zipfile))
            {
                File.Delete(zipfile);
            }
            using (ZipOutputStream zipStream = new ZipOutputStream(File.Create(zipfile)))
            {

                zipStream.SetLevel(9); // 0 - store only to 9 - means best compression

                byte[] buffer = new byte[4096];
                foreach (string file in files)
                {

                    // Using GetFileName makes the result compatible with XP
                    // as the resulting path is not absolute.
                    var entry = new ZipEntry(Path.GetFileName(file));

                    // Setup the entry data as required.

                    // Crc and size are handled by the library for seakable streams
                    // so no need to do them here.

                    // Could also use the last write time or similar for the file.
                    entry.DateTime = DateTime.Now;
                    zipStream.PutNextEntry(entry);

                    using (FileStream fs = File.OpenRead(file))
                    {

                        // Using a fixed size buffer here makes no noticeable difference for output
                        // but keeps a lid on memory usage.
                        int sourceBytes;
                        do
                        {
                            sourceBytes = fs.Read(buffer, 0, buffer.Length);
                            zipStream.Write(buffer, 0, sourceBytes);
                        } while (sourceBytes > 0);
                    }
                }

                // Finish/Close arent needed strictly as the using statement does this automatically

                // Finish is important to ensure trailing information for a Zip file is appended.  Without this
                // the created file would be invalid.
                zipStream.Finish();

                // Close is important to wrap things up and unlock the file.
                zipStream.Close();
            }
        }

        public static IList<string> Unzip(string zipfile, string destfolder, bool is_overwrite = true, bool isDeleteZipFile = true)
        {
            Directory.CreateDirectory(destfolder);
            IList<string> files = new List<string>();
            using (ZipInputStream zipStream = new ZipInputStream(File.OpenRead(zipfile)))
            {
                // here, we extract every entry, but we could extract conditionally
                // based on entry name, size, date, checkbox status, etc.  
                ZipEntry theEntry;
                while ((theEntry = zipStream.GetNextEntry()) != null)
                {
                    string directoryName = Path.GetDirectoryName(theEntry.Name);
                    string fileName = Path.GetFileName(theEntry.Name);

                    // create directory
                    if (directoryName.Length > 0)
                    {
                        Directory.CreateDirectory(Path.Combine(destfolder, directoryName));
                    }

                    if (string.IsNullOrWhiteSpace(fileName))
                    {
                        continue;
                    }

                    string filePath = Path.Combine(destfolder, theEntry.Name);

                    if(!is_overwrite && File.Exists(filePath))
                    {
                        continue;
                    }

                    using (FileStream streamWriter = File.Create(filePath))
                    {

                        int size = 2048;
                        byte[] data = new byte[2048];
                        while (true)
                        {
                            size = zipStream.Read(data, 0, data.Length);
                            if (size == 0)
                            {
                                break;
                            }
                            streamWriter.Write(data, 0, size);
                        }
                    }

                    files.Add(filePath);
                }
            }

            if (isDeleteZipFile)
            {
                File.Delete(zipfile);
            }

            return files;
        }
    }
}
