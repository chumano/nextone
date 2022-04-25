using System.Collections.Generic;

namespace MapService.DTOs.Map
{
    public class UpdateMapDTO
    {
        public string Name { get; set; }
        public string Note { get; set; }
        public IList<MapLayerDTO> Layers { get; set; }
    }
}
