using Microsoft.AspNetCore.Http;

namespace MapService.DTOs.IconSymbol
{
    public class CreateSymbolDTO
    {
        public string Name { get; set; }
        public IFormFile File { get; set; }
    }
}
