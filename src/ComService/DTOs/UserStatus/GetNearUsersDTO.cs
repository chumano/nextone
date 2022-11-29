namespace ComService.DTOs.UserStatus
{
    public class GetNearUsersDTO
    {
        public double DistanceInMeter { get; set; }

        public double Lat { get; set; }
        public double Lon { get; set; }

        public int Offset { get; set; }
        public int PageSize { get; set; }
    }

    public class UserNearDTO
    {
        public ComService.Domain.UserStatus User { get; set; }
        public double DistanceInMeter { get; set; }
    }
}
