using System;
using System.Drawing.Imaging;
using System.IO;

namespace MapService.Utils
{
    public class ImageHelper
    {
        public static byte[] ImageToByteArray(System.Drawing.Image imageIn)
        {
            using (var ms = new MemoryStream())
            {
                imageIn.Save(ms, ImageFormat.Jpeg);
                return ms.ToArray();
            }

        }

        public static string BytesImageToBase64Url(byte[] ImageData)
        {
            if(ImageData == null) return null;

            string imageBase64Data = Convert.ToBase64String(ImageData);
            string imageDataURL = string.Format("data:image/jpg;base64,{0}", imageBase64Data);
            return imageDataURL;
        }
    }
}
