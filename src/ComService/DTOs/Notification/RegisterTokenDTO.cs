namespace ComService.DTOs.Notification
{
    public class RegisterTokenDTO
    {
        public string OldToken { get; set; }
        public string Token { get; set; }
        public string Topic { get; set; }
    }
    public class RemoveTokenDTO
    {
        public string Token { get; set; }
        public string Topic { get; set; }
    }
    
}
