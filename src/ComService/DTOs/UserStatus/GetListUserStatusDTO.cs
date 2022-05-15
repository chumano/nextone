namespace ComService.DTOs.UserStatus
{
    public class GetListUserStatusDTO
    {
        public bool ExcludeMe { get; set; }
        public int Offset { get; set; }
        public int PageSize { get; set; }
    }
}
