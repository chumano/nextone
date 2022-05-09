using MapService.Utils;

namespace MapService.DTOs.IconSymbol
{
    public class SymbolDTO
    {
        public string Name { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public string ImageUrl { get; set; }
        public static SymbolDTO From(MapService.Domain.IconSymbol iconSymbol)
        {

            string imageUrl = null;
            if (iconSymbol.ImageData != null)
            {
                imageUrl = ImageHelper.BytesImageToBase64Url(iconSymbol.ImageData);
            }
            return new SymbolDTO
            {
                Name = iconSymbol.Name,
                Width = iconSymbol.Width,
                Height = iconSymbol.Height,
                ImageUrl = imageUrl
            };
        }
    }
}
