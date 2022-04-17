using ComService.DTOs.Conversation;
using ComService.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComService.Boudaries.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ConversationController : ControllerBase
    {
        private readonly ILogger<ConversationController> _logger;
        private readonly IConversationService _conversationService;
        public ConversationController(
             ILogger<ConversationController> logger,
            IConversationService conversationService)
        {
            _logger = logger;
            _conversationService = conversationService;
        }

        [HttpGet("GetList")]
        public IActionResult GetList()
        {
            throw new NotImplementedException();
        }

        [HttpGet("{id}")]
        public IActionResult Get(string id)
        {
            throw new NotImplementedException();
        }

        [HttpGet("GetMessageHistory")]
        public IActionResult GetMessageHistory(string id)
        {
            throw new NotImplementedException();
        }

        [HttpPost("CreateConversation")]
        public IActionResult CreateConversation(CreateConverationDTO createConverationDTO)
        {
            throw new NotImplementedException();
        }

        [HttpPost("CreateMessage")]
        public IActionResult CreateMessage(CreateMessageDTO createMessageDTO)
        {
            throw new NotImplementedException();
        }

        [HttpPost("AddMember")]
        public IActionResult AddMember()
        {
            throw new NotImplementedException();
        }

        [HttpPost("RemoveMember")]
        public IActionResult RemoveMember()
        {
            throw new NotImplementedException();
        }

        [HttpPost("UpdateMemberRole")]
        public IActionResult UpdateMemberRole()
        {
            throw new NotImplementedException();
        }
    }
}
