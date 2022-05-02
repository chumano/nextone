using Grpc.Core;
using IdentityService.Data;
using IdentityService.Models;
using Microsoft.AspNetCore.Identity;
using NextOne.Common;
using NextOne.Protobuf.Identity;
using NextOne.Shared.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityService.Boundaries.Grpc
{
    public class GrpcIdentityService : NextOne.Protobuf.Identity.GrpcIdentityService.GrpcIdentityServiceBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IUserContext _userContext;
        public GrpcIdentityService(ApplicationDbContext dbContext,
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager,
            IUserContext userContext)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _roleManager = roleManager;
            _userContext = userContext;
        }

        public override Task<HelloReply> SayHello(HelloRequest request, ServerCallContext context)
        {
            return Task.FromResult(new HelloReply()
            {
                Message = "Reply from Identity serivce :" + DateTime.Now.ToString()
            });
        }

        public override async Task<CreateIdentityUserResponse> CreateIdentityUser(CreateIdentityUserRequest request, ServerCallContext context)
        {
            var actionUser = _userContext.User;
            var user = new ApplicationUser()
            {
                UserName = request.UserName,
                Email = request.Email,
                LockoutEnabled = false,
                ApplicationSystem = "NextOne"
            };
         
            IdentityResult identityResult = await _userManager.CreateAsync(user, "Nextone@123");

            if (!identityResult.Succeeded || identityResult.Errors.Any())
            {
                var errorResult = new CreateIdentityUserResponse()
                {
                    IsSuccess = false,
                    Error = new Error()
                    {
                        Message = identityResult.Errors.First().Description
                    }
                };

                return errorResult;
            }

            user = await _userManager.FindByIdAsync(request.UserId);

            foreach (var roleName in request.RoleNames)
            {
                var role = await _roleManager.FindByNameAsync(roleName);
                await _userManager.AddToRoleAsync(user, role.NormalizedName);
            }

            return new CreateIdentityUserResponse()
            {
                IsSuccess = true,
                IdentityUserId = user.Id
            };
        }

        public override async Task<UpdateIdentityUserResponse> UpdateIdentityUser(UpdateIdentityUserRequest request, ServerCallContext context)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);
            user.UserName = request.UserName;
            user.Email = request.Email;

            var identityResult = await _userManager.UpdateAsync(user);

            if (!identityResult.Succeeded || identityResult.Errors.Any())
            {
                var errorResult = new UpdateIdentityUserResponse()
                {
                    IsSuccess = false,
                    Error = new Error()
                    {
                        Message = identityResult.Errors.First().Description
                    }
                };

                return errorResult;
            }

            return new UpdateIdentityUserResponse()
            {
                IsSuccess = true
            };
        }

        public override async Task<ActiveIdentityUserResponse> ActiveIdentityUser(ActiveIdentityUserRequest request, ServerCallContext context)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);
            var lockoutEnabled = !request.Active;
            var identityResult =  await _userManager.SetLockoutEnabledAsync(user, lockoutEnabled);

            if (!identityResult.Succeeded || identityResult.Errors.Any())
            {
                var errorResult = new ActiveIdentityUserResponse()
                {
                    IsSuccess = false,
                    Error = new Error()
                    {
                        Message = identityResult.Errors.First().Description
                    }
                };

                return errorResult;
            }

            return new ActiveIdentityUserResponse()
            {
                IsSuccess = true
            };
        }

        public override async Task<UpdateIdentityUserRolesResponse> UpdateIdentityUserRoles(UpdateIdentityUserRolesRequest request, ServerCallContext context)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);
            var currentRoleNames = await _userManager.GetRolesAsync(user);
           

            var currentRoles = _roleManager.Roles.Where(x => currentRoleNames.Contains(x.Name)).ToList();
            
            //remove old roles
            await _userManager.RemoveFromRolesAsync(user, currentRoles.Select(x => x.NormalizedName));
            //assign new roles 
            var newRoles = _roleManager.Roles.Where(x => request.RoleNames.Contains(x.Name)).ToList();

            foreach (var role in newRoles)
            {
                await _userManager.AddToRoleAsync(user, role.NormalizedName);
            }

            return new UpdateIdentityUserRolesResponse()
            {
                IsSuccess = true
            };
        }

        public override async Task<CreateIdentityRoleResponse> CreateIdentityRole(CreateIdentityRoleRequest request, ServerCallContext context)
        {
            var isExist = await _roleManager.RoleExistsAsync(request.RoleName);
            if (isExist)
            {
                var errorResult = new CreateIdentityRoleResponse()
                {
                    IsSuccess = false,
                    Error = new Error()
                    {
                        Message = $"{request.RoleName} exists"
                    }
                };

                return errorResult;
            }

            var identityResult = await _roleManager.CreateAsync(new ApplicationRole()
            {
                Name = request.RoleName,
                DisplayName = request.RoleDisplayName,
                NormalizedName = request.RoleName.ToUpper()
            });

            if (!identityResult.Succeeded || identityResult.Errors.Any())
            {
                var errorResult = new CreateIdentityRoleResponse()
                {
                    IsSuccess = false,
                    Error = new Error()
                    {
                        Message = identityResult.Errors.First().Description
                    }
                };

                return errorResult;
            }
            return new CreateIdentityRoleResponse()
            {
                IsSuccess = true
            };
        }

        public override async Task<UpdateIdentityRoleResponse> UpdateIdentityRole(UpdateIdentityRoleRequest request, ServerCallContext context)
        {
            var role = await _roleManager.FindByNameAsync(request.RoleName);
            if (role == null)
            {
                var errorResult = new UpdateIdentityRoleResponse()
                {
                    IsSuccess = false,
                    Error = new Error()
                    {
                        Message = $"{request.RoleName} does not exist"
                    }
                };

                return errorResult;
            }

            role.DisplayName = request.RoleDisplayName;

            var identityResult = await _roleManager.UpdateAsync(role);

            if (!identityResult.Succeeded || identityResult.Errors.Any())
            {
                var errorResult = new UpdateIdentityRoleResponse()
                {
                    IsSuccess = false,
                    Error = new Error()
                    {
                        Message = identityResult.Errors.First().Description
                    }
                };

                return errorResult;
            }
            return new UpdateIdentityRoleResponse()
            {
                IsSuccess = true
            };
        }

        public override async Task<DeleteIdentityRoleResponse> DeleteIdentityRole(DeleteIdentityRoleRequest request, ServerCallContext context)
        {
            var role = await _roleManager.FindByNameAsync(request.RoleName);
            if (role == null)
            {
                var errorResult = new DeleteIdentityRoleResponse()
                {
                    IsSuccess = false,
                    Error = new Error()
                    {
                        Message = $"{request.RoleName} does not exist"
                    }
                };

                return errorResult;
            }

            var identityResult = await _roleManager.DeleteAsync(role);

            if (!identityResult.Succeeded || identityResult.Errors.Any())
            {
                var errorResult = new DeleteIdentityRoleResponse()
                {
                    IsSuccess = false,
                    Error = new Error()
                    {
                        Message = identityResult.Errors.First().Description
                    }
                };

                return errorResult;
            }

            return new DeleteIdentityRoleResponse()
            {
                IsSuccess = true
            };
        }
    }
}
