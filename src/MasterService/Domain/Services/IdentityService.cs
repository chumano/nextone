using Grpc.Core;
using MasterService.Utils;
using NextOne.Protobuf.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static NextOne.Protobuf.Identity.GrpcIdentityService;

namespace MasterService.Domain.Services
{
    public interface IIdentityService
    {
        Task CreateIdentityUser(string userId, string userName, string email);
        Task UpdateIdentityUser(string userId, string userName, string email);
        Task ActiveIdentityUser(string userId, bool isActive);
        Task UpdateIdentityUserRoles(string userId, IList<string> roleNames);

        Task<string> ResetPassword(string userId, string newPassword);

        Task CreateIdentityRole(string roleName, string displayName);
        Task UpdateIdentityRole(string roleName, string displayName);
        Task DeleteIdentityRole(string roleName);

    }
    public class IdentityService : IIdentityService
    {
        private readonly GrpcIdentityServiceClient _grpcServiceClient;

        public IdentityService(GrpcIdentityServiceClient grpcIdentityServiceClient)
        {
            _grpcServiceClient = grpcIdentityServiceClient;
        }

        public async Task SayHello()
        {
            var token = "accessToken";
            var headers = new Metadata();
            headers.Add("Authorization", $"Bearer {token}");

            await _grpcServiceClient.SayHelloAsync(new NextOne.Common.HelloRequest()
            {
                Name = "Say hello from MasterService"
            },headers);
        }

        public async Task CreateIdentityUser(string userId, string userName, string email)
        {
            var response = await _grpcServiceClient.CreateIdentityUserAsync(new CreateIdentityUserRequest()
            {
                UserId = userId,
                UserName = userName,
                Email = email,
            });
            if (!response.IsSuccess)
            {
                throw new Exception("CreateIdentityUser: " + response.Error.Message);
            }
        }

        public async Task UpdateIdentityUser(string userId, string userName, string email)
        {
            var response = await _grpcServiceClient.UpdateIdentityUserAsync(new UpdateIdentityUserRequest()
            {
                UserId = userId,
                UserName = userName,
                Email = email
            });

            if (!response.IsSuccess)
            {
                throw new Exception("UpdateIdentityUser: " + response.Error.Message);
            }
        }

        public async Task ActiveIdentityUser(string userId, bool isActive)
        {
            var response = await _grpcServiceClient.ActiveIdentityUserAsync(new ActiveIdentityUserRequest()
            {
                UserId = userId,
                Active = isActive
            });
            if (!response.IsSuccess)
            {
                throw new Exception("ActiveIdentityUser: " + response.Error.Message);
            }
        }

        public async Task UpdateIdentityUserRoles(string userId, IList<string> roleNames)
        {
            var request = new UpdateIdentityUserRolesRequest()
            {
                UserId = userId,
            };
            request.RoleNames.AddRange(roleNames);
            var response = await _grpcServiceClient.UpdateIdentityUserRolesAsync(request);
            if (!response.IsSuccess)
            {
                throw new Exception("UpdateIdentityUserRoles: " + response.Error.Message);
            }
        }

        public async Task<string> ResetPassword(string userId, string newPassword)
        {
            var response = await _grpcServiceClient.ResetPasswordAsync(new ResetPasswordRequest()
            {
                UserId = userId,
                NewPassword = newPassword
            });
            if (!response.IsSuccess)
            {
                throw new Exception("ResetPassword: " + response.Error.Message);
            }

            return newPassword;
        }

        public async Task CreateIdentityRole(string roleName, string displayName)
        {
            var response = await _grpcServiceClient.CreateIdentityRoleAsync(new CreateIdentityRoleRequest()
            {
                RoleName = roleName,
                RoleDisplayName = displayName
            });
            if (!response.IsSuccess)
            {
                throw new Exception("CreateIdentityRole: " + response.Error.Message);
            }
        }

        public async Task UpdateIdentityRole(string roleName, string displayName)
        {
            var response = await _grpcServiceClient.UpdateIdentityRoleAsync(new UpdateIdentityRoleRequest()
            {
                RoleName = roleName,
                RoleDisplayName = displayName
            });
            if (!response.IsSuccess)
            {
                throw new Exception("UpdateIdentityRole: " + response.Error.Message);
            }
        }
        public async Task DeleteIdentityRole(string roleName)
        {
            var response = await _grpcServiceClient.DeleteIdentityRoleAsync(new DeleteIdentityRoleRequest()
            {
                RoleName = roleName
            });
            if (!response.IsSuccess)
            {
                throw new Exception("DeleteIdentityRole: " + response.Error.Message);
            }
        }

        
    }
}
