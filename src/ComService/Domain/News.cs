using System;

namespace ComService.Domain
{
    public class News
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Content { get; set; }

        public string ImageUrl { get; set; }
        public string ImageDescription { get; set; }

        public bool IsPublished { get; set; }

        public DateTime PublishedDate { get; set; }
        public string PublishedBy { get; set; }
        public string PublishedUserName { get; set; }
    }
}
