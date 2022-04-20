using System;
using System.Drawing;

namespace MapService.Utils
{
    public class ColorHelper
    {
        static readonly Random random = new Random();
        static readonly string[] colors;

        static ColorHelper()
        {
            colors = "#4F6A0A,#12D416,#27db82,#9ed416,#a93dff,#663bff,#165cff,#1f5ad9,#241fb5,#498AC0,#18b22a,#295b84,#4A90E2,#009900,#AFB4B6"
                .Split(new string[] { ",", " " }, StringSplitOptions.RemoveEmptyEntries);
        }

        public static Color FromHex(string hex)
        {
            return System.Drawing.ColorTranslator.FromHtml(hex);
        }

        public static Color RandomColor
        {
            get
            {
                return FromHex(colors[random.Next(colors.Length)]);
            }
        }

    }
}
