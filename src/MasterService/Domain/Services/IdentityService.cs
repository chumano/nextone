using Grpc.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static NextOne.Protobuf.Identity.GrpcIdentityService;

namespace MasterService.Domain.Services
{
    public interface IIdentityService
    {
    }
    public class IdentityService : IIdentityService
    {
        private readonly GrpcIdentityServiceClient _grpcServiceClient;

        public IdentityService(GrpcIdentityServiceClient grpcIdentityServiceClient)
        {
            _grpcServiceClient = grpcIdentityServiceClient;

            
        }

        public async Task SayABC()
        {
            var token = "accessToken";
            var headers = new Metadata();
            headers.Add("Authorization", $"Bearer {token}");

            await _grpcServiceClient.SayHelloAsync(new NextOne.Protobuf.Identity.HelloRequest()
            {
                Name = "Say hello from MasterService"
            },headers);
        }
    }
}
