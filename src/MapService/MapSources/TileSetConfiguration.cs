using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MapService.MapSources
{
    public class TileSetConfiguration
    {
        public string Format { get; set; }

        public string Name { get; set; }

        public string Source { get; set; }

        /// <summary>
        /// TMS type Y coord (true: Y going from bottom to top; false: from top to bottom, like in OSM tiles)
        /// </summary>
        public bool Tms { get; set; }

        public bool UseCoordinatesCache { get; set; }
    }
}
