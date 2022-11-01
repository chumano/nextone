namespace ComService.Infrastructure.AppSettings
{
    public class FireBaseOptions
    {
        public bool Enabled { get; set; } = true;
        public string KeyPath { get; set; } = "firebasekey.json";
        public int SendBatchMessageNumber { get; set; } = 100;
    }
}
