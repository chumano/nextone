namespace ComService.Boudaries.Hubs
{
    public interface IOnlineClient
    {
        string ConnectionId { get; }
        string UserId { get; }
        string UserName { get; }
    }

    public class OnlineClient : IOnlineClient
    {
        public string ConnectionId { get; set; }
        public string UserId { get; set; }

        public string UserName { get; set; }

    }
}