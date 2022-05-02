using MasterService.Domain.DomainEvents;
using MasterService.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using NextOne.Shared.Bus;
using NextOne.Shared.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.Domain.Services
{
    public interface IUserService
    {
        Task<User> Get(string userId);

        Task<IList<User>> GetUsers(PageOptions pageOptions);
        Task<User> CreateUser(string name, string email, string phone);

        Task<User> UpdateUser(User user, string name, string email, string phone,
            List<string> roleCodes);

        Task Active(User user, bool isActive);

        Task DeleteUser(User user);

    }

    public class UserService : IUserService
    {
        private readonly UserRepository _userRepository;
        private readonly RoleRepository _roleRepository;
        private readonly IIdentityService _identityService;
        private readonly IdGenerator _idGenerator;
        private readonly IBus _bus;
        public UserService(UserRepository userRepository,
            RoleRepository roleRepository,
            IIdentityService identityService,
            IdGenerator idGenerator,
            IBus bus)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _identityService = identityService;
            _idGenerator = idGenerator;
            _bus = bus;
        }

        public async Task<User> Get(string userId)
        {
            return await _userRepository.Get(userId);
        }

        public async Task<IList<User>> GetUsers(PageOptions pageOptions)
        {
            var users = await _userRepository.Users
                    .OrderBy(o => o.Name)
                    .Skip(pageOptions.Offset)
                    .Take(pageOptions.PageSize)
                    .ToListAsync();

            return users;
        }

        public async Task<User> CreateUser(string name, string email, string phone)
        {
            var id = _idGenerator.GenerateNew();
            var user = new User(id, name, email, phone);

            user.CreatedDate = DateTime.Now;
            user.UpdatedDate = DateTime.Now;
            _userRepository.Add(user);

            await _identityService.CreateIdentityUser(user.Id, email.ToLower(), email);

            await _userRepository.SaveChangesAsync();

            //TODO : Send domainevent UserCreated
            await _bus.Publish(new UserCreated());
            return user;
        }

        public async Task<User> UpdateUser(User user, string name, string email, string phone,
            List<string> roleCodes)
        {
            var roles = await _roleRepository.Roles
                    .Where(o => roleCodes.Contains(o.Code))
                    .ToListAsync();
            var userRoles = roles.Select(o => new UserRole()
            {
                RoleCode = o.Code,
                Role = o
            }).ToList();
            user.Name = name;
            user.Email = email;
            user.Phone = phone;
            user.SetRoles(userRoles);

            user.UpdatedDate = DateTime.Now;
            _userRepository.Update(user);

            await _identityService.UpdateIdentityUser(user.Id, email.ToLower(), email);
            await _identityService.UpdateIdentityUserRoles(user.Id, userRoles.Select(o=>o.RoleCode).ToList());

            await _userRepository.SaveChangesAsync();

            //TODO : Send domainevent UserUpdated
            await _bus.Publish(new UserUpdated());
            return user;
        }

        public async Task Active(User user, bool isActive)
        {
            user.IsActive = isActive;

            _userRepository.Update(user);

            await _identityService.ActiveIdentityUser(user.Id, isActive);

            await _userRepository.SaveChangesAsync();

            //TODO : Send domainevent UserActived
            await _bus.Publish(new UserActived());
        }

        public async Task DeleteUser(User user)
        {
            _userRepository.Delete(user);

            await _identityService.ActiveIdentityUser(user.Id, isActive: false);

            await _userRepository.SaveChangesAsync();

            //TODO : Send domainevent UserDeleted

            await _bus.Publish(new UserDeleted());
        }
       
    }
}
