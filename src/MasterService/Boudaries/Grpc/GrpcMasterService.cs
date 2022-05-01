using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using NextOne.Protobuf.Master;

namespace MasterService.Boudaries.Grpc
{
    public class GrpcMasterService : NextOne.Protobuf.Master.GrpcMasterService.GrpcMasterServiceBase
    {
        public override Task<HelloReply> SayHello(HelloRequest request, ServerCallContext context)
        {
            var user = context.GetHttpContext().User;

            return Task.FromResult(new HelloReply()
            {
                Message = "Reply from Master serivce :" +DateTime.Now.ToString()
            });
        }
    }
}
