using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static NextOne.Protobuf.Master.GrpcMasterService;

namespace ComService.Domain.Services
{
    public interface IMasterService
    {
    }
    public class MasterService : IMasterService
    {
        private readonly GrpcMasterServiceClient _grpcServiceClient;

        public MasterService(GrpcMasterServiceClient grpcIdentityServiceClient)
        {
            _grpcServiceClient = grpcIdentityServiceClient;

        }

        public async Task SayABC()
        {
            await _grpcServiceClient.SayHelloAsync(new NextOne.Protobuf.Master.HelloRequest()
            {
                Name = "Say hello from MasterService"
            });
        }
    }
}
