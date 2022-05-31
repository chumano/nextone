namespace ComService.DTOs.News
{
    public class CreateNewsDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Content { get; set; }

        public string ImageUrl { get; set; }
        public string ImageDescription { get; set; }
    }
}
