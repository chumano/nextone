﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.DTOs.Conversation
{
    public class GetListConversationDTO
    {
        public int Offset { get; set; }
        public int PageSize { get; set; }
    }
}
