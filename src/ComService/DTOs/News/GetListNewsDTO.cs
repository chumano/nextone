using System;

namespace ComService.DTOs.News
{
    public class GetListNewsDTO
    {
        public int Offset { get; set; }
        public int PageSize { get; set; }

        public YesNoEnum? PublishState { get; set; }

        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}
