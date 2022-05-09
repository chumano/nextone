namespace MapService.Domain
{
    public class IconSymbol
    {
        private IconSymbol() { }
        public string Name { get; private set; }
        public int Width { get; private set; }
        public int Height { get; private set; }
        public byte[] ImageData { get; private set; }
        public IconSymbol(string name, 
            int width,
            int height,
            byte[] bytes)
        {
            this.Name = name;
            this.Width = width;
            this.Height = height;
            this.ImageData = bytes;
        }

    }
}
