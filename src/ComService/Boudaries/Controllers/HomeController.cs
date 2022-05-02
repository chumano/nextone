using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NextOne.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static NextOne.Protobuf.Master.GrpcMasterService;

namespace ComService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HomeController : ControllerBase
    {

        private readonly ILogger<HomeController> _logger;
        private readonly GrpcMasterServiceClient _grpcMasterServiceClient;

        public HomeController(ILogger<HomeController> logger, GrpcMasterServiceClient grpcMasterServiceClient)
        {
            _logger = logger;
            _grpcMasterServiceClient = grpcMasterServiceClient;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var reply = await _grpcMasterServiceClient.SayHelloAsync(new HelloRequest()
            {
                Name = "loc"
            });
            return Ok("ComService - reply: "+ reply.Message);
        }
    }
}
