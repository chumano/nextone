namespace MapService.DTOs.Map
{
    public class GetMapDTO
    {
        public string TextSearch { get; set; }
        public int Offset { get; set; }
        public int PageSize { get; set; }
    }
    public class CounMapDTO
    {
        public string TextSearch { get; set; }
    }
}
