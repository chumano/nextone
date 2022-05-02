using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Core;
using MasterService.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using NextOne.Common;
using NextOne.Protobuf.Master;

namespace MasterService.Boudaries.Grpc
{
    public class GrpcMasterService : NextOne.Protobuf.Master.GrpcMasterService.GrpcMasterServiceBase
    {
        private readonly IUserRepository _userRepository;
        public GrpcMasterService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public override Task<HelloReply> SayHello(HelloRequest request, ServerCallContext context)
        {
            var user = context.GetHttpContext().User;

            return Task.FromResult(new HelloReply()
            {
                Message = "Reply from Master serivce :" +DateTime.Now.ToString()
            });
        }

        public override async Task<GetUsersByIdsResponse> GetUsersByIds(GetUsersByIdsRequest request, ServerCallContext context)
        {
            var users = await _userRepository.Users
                    .Where(o => request.UserIds.Contains(o.Id))
                    .ToListAsync();

            var response =  new GetUsersByIdsResponse();
            response.Users.AddRange(users.Select(o => new UserDto()
            {
                UserId = o.Id,
                UserName = o.Name,
                UserEmail = o.Email,
                IsActive = o.IsActive
            }));

            return response;
        }
    }
}
