using Grpc.Core;
using NextOne.Protobuf.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityService.Boundaries.Grpc
{
    public class GrpcIdentityService : NextOne.Protobuf.Identity.GrpcIdentityService.GrpcIdentityServiceBase
    {
        public override Task<HelloReply> SayHello(HelloRequest request, ServerCallContext context)
        {
            return Task.FromResult(new HelloReply()
            {
                Message = "Reply from Identity serivce :" + DateTime.Now.ToString()
            });
        }
    }
}
