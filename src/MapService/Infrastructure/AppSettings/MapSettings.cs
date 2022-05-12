namespace MapService.Infrastructure.AppSettings
{
    public class MapSettings
    {
        public string MapTilesFolder { get; set; }
        public int MapWatcherIntervalInMinutes { get; set; }
        public double MapOffsetX { get; set; }
        public double MapOffsetY { get; set; }
    }
}
