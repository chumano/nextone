using ComService.Domain;

namespace ComService.DTOs.Search
{
    public class SearchDTO
    {
        public string TextSearch { get; set; }
        public ConversationTypeEnum? ConversationType { get; set; }
    }
}
