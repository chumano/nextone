﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.DTOs.Conversation
{
    public class AddMembersDTO
    {
        public string ConversationId { get; set; }
        public List<string> MemberIds { get; set; }
    }

}
