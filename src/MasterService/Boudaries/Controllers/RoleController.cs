using MasterService.Domain;
using MasterService.Domain.Repositories;
using MasterService.Domain.Services;
using MasterService.DTOs.Role;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NextOne.Infrastructure.Core;
using NextOne.Shared.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.Boudaries.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly ILogger<RoleController> _logger;
        private readonly RoleRepository _roleRepository;
        private readonly IIdentityService _identityService;
        public RoleController(ILogger<RoleController> logger,
            RoleRepository roleRepository,
            IIdentityService identityService)
        {
            _logger = logger;
            _roleRepository = roleRepository;
            _identityService = identityService;
        }

        [HttpGet("GetList")]
        public async Task<IActionResult> GetList()
        {
            var items = await _roleRepository.Roles.ToListAsync();

            return Ok(ApiResult.Success(items));
        }

        [HttpGet("GetPermissions")]
        public async Task<IActionResult> GetPermissions()
        {
            var items = await _roleRepository.Permissions.ToListAsync();

            return Ok(ApiResult.Success(items));
        }


        [HttpGet("{code}")]
        public async Task<IActionResult> Get(string code)
        {
            var item = await _roleRepository.Get(code);
            return Ok(ApiResult.Success(item));
        }

        [HttpPost("CreateRole")]
        public async Task<IActionResult> CreateRole([FromBody] CreateRoleDTO roleDTO)
        {
            var role = await _roleRepository.Get(roleDTO.Code);
            if (role != null)
            {
                throw new DomainException("", "");
            }

            role = new Domain.Role(roleDTO.Code, roleDTO.Name);

            _roleRepository.Add(role);

            await _identityService.CreateIdentityRole(role.Code, role.Name);

            await _roleRepository.SaveChangesAsync();

            return Ok(ApiResult.Success(role));
        }

        [HttpPost("UpdateRole")]
        public async Task<IActionResult> UpdateRole([FromBody] UpdateRoleDTO roleDTO)
        {
            var role = await _roleRepository.Get(roleDTO.Code);
            if (role == null)
            {
                throw new DomainException("", "");
            }

            
            var permissions = await _roleRepository.Permissions
                    .Where(o => roleDTO.PermissionCodes.Contains(o.Code))
                    .ToListAsync();
            var rolePermissions = permissions.Select(o => new RolePermission()
            {
                PermissionCode = o.Code
            }).ToList();

            role.SetName(roleDTO.Name);
            role.SetPermissions(rolePermissions);
            _roleRepository.Update(role);

            await _identityService.UpdateIdentityRole(role.Code, role.Name);

            await _roleRepository.SaveChangesAsync();
            return Ok(ApiResult.Success(null));
        }


        [HttpDelete("{code}")]
        public async Task<IActionResult> Delete(string code)
        {
            var role = await _roleRepository.Get(code);
            if (role == null)
            {
                throw new DomainException("", "");
            }

            _roleRepository.Delete(role);

            await _identityService.DeleteIdentityRole(role.Code);

            await _roleRepository.SaveChangesAsync();
            return Ok(ApiResult.Success(null));
        }
    }
}
