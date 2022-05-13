namespace MapService.DTOs.Map
{
    public enum YesNoEnum {
        All,
        Yes,
        No
    }
    public class GetMapDTO
    {
        public string TextSearch { get; set; }
        public int Offset { get; set; }
        public int PageSize { get; set; }
        public YesNoEnum? PublishState { get; set; }
    }
    public class CounMapDTO
    {
        public string TextSearch { get; set; }
    }
}
