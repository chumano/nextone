using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

namespace MapService.Utils
{
    public class ImageHelper
    {
        public static byte[] ImageToByteArray(System.Drawing.Image imageIn, ImageFormat imageFormat =null)
        {
            using (var ms = new MemoryStream())
            {
                imageIn.Save(ms, imageFormat??ImageFormat.Png);
                return ms.ToArray();
            }

        }

        public static System.Drawing.Image ImageFroBytes(byte[] bytes)
        {
            Image image;
            using (MemoryStream ms = new MemoryStream(bytes))
            {
                image = Image.FromStream(ms);
            }
            return image;
        }

        public static System.Drawing.Image ImageFromBase64Url(string bace64ImageDataURL)
        {
            bace64ImageDataURL = bace64ImageDataURL.Replace("data:image/jpg;base64,", "");
            byte[] bytes = Convert.FromBase64String(bace64ImageDataURL);
            return ImageFroBytes(bytes);
        }

        public static string BytesImageToBase64Url(byte[] ImageData)
        {
            if(ImageData == null) return null;

            string imageBase64Data = Convert.ToBase64String(ImageData);
            string imageDataURL = string.Format("data:image/jpg;base64,{0}", imageBase64Data);
            return imageDataURL;
        }
        public static Bitmap ResizeImage(Bitmap imgToResize, Size? size = null)
        {
            if (size == null) size = new Size(100, 100);
            int sourceWidth = imgToResize.Width;
            int sourceHeight = imgToResize.Height;

            
            var nPercentW = ((float)size?.Width / (float)sourceWidth);
            var nPercentH = ((float)size?.Height / (float)sourceHeight);
            float nPercent = nPercentW;
            if (nPercentH < nPercentW)
                nPercent = nPercentH;

            int destWidth = (int)(sourceWidth * nPercent);
            int destHeight = (int)(sourceHeight * nPercent);

            Bitmap b = new Bitmap(destWidth, destHeight);
            {
                using (Graphics g = Graphics.FromImage((Image)b))
                {
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.DrawImage(imgToResize, 0, 0, destWidth, destHeight);
                }

            }

            return b;
        }

        public static Image CropImage(Image img, Rectangle cropArea)
        {
            Bitmap bmpImage = new Bitmap(img);
            return bmpImage.Clone(cropArea, bmpImage.PixelFormat);
        }

    }
}
