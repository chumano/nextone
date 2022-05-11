using System;

namespace MapService.Domain
{
    public class MapContainer
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int Version { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime LastUsed { get; set; }
        public SharpMap.Map Map { get; set; }
    }
}
