using NextOne.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static NextOne.Protobuf.Master.GrpcMasterService;

namespace ComService.Domain.Services
{
    public interface IMasterService
    {
        Task<MasterUser> GetUserAsync(string userId);
        Task<IList<MasterUser>> GetUsersAsync(IList<string> userIds);
    }
    public class MasterService : IMasterService
    {
        private readonly GrpcMasterServiceClient _grpcServiceClient;

        public MasterService(GrpcMasterServiceClient grpcIdentityServiceClient)
        {
            _grpcServiceClient = grpcIdentityServiceClient;

        }

        public async Task SayHello()
        {
            await _grpcServiceClient.SayHelloAsync(new HelloRequest()
            {
                Name = "Say hello from MasterService" 
            });
        }

        public async Task<MasterUser> GetUserAsync(string userId)
        {
            var request = new NextOne.Protobuf.Master.GetUsersByIdsRequest();
            request.UserIds.Add(userId);
            var response = await _grpcServiceClient.GetUsersByIdsAsync(request);

            var user = response.Users.FirstOrDefault();
            if(user == null)
            {
                return null;
            }

            return new MasterUser()
            {
                UserId = user.UserId,
                UserName = user.UserName
            };
        }

        public async Task<IList<MasterUser>> GetUsersAsync(IList<string> userIds)
        {
            var request = new NextOne.Protobuf.Master.GetUsersByIdsRequest();
            request.UserIds.Add(userIds);
            var response = await _grpcServiceClient.GetUsersByIdsAsync(request);

            var users = response.Users;

            return users.Select(user => new MasterUser()
            {
                UserId = user.UserId,
                UserName = user.UserName
            }).ToList();
        }
    }
}
