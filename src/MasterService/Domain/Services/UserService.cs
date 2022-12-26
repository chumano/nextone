using MasterService.Domain.DomainEvents;
using MasterService.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using NextOne.Shared.Bus;
using NextOne.Shared.Common;
using NextOne.Shared.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MasterService.Domain.Services
{
    public interface IUserService
    {
        Task<User> Get(string userId);

        Task<User> GetUserByEmail(string email);

        Task<IList<User>> GetUsers(PageOptions pageOptions, string textSearch);
        Task<int> Count(string textSearch);

        Task CreateUserFromIdentityUser(string userId);

        Task<User> CreateUser(string name, string email, string phone, string createdBy);

        Task<User> UpdateUser(User user, string name, string email, string phone, string updatedBy);

        Task<User> UpdateUserRoles(User user, List<string> roleCodes, string updatedBy);

        Task Active(User user, bool isActive, string updatedBy);

        Task DeleteUser(User user, bool isSelf, string deletedBy);

    }

    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IIdentityService _identityService;
        private readonly IdGenerator _idGenerator;
        private readonly IBus _bus;
        public UserService(IUserRepository userRepository,
            IRoleRepository roleRepository,
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

        public async Task<IList<User>> GetUsers(PageOptions pageOptions, string textSearch)
        {
            var query = _userRepository.Users;

            if (!string.IsNullOrWhiteSpace(textSearch))
            {
                query = query.Where(o => o.Name.Contains(textSearch));
            }

            query = query.OrderBy(o => o.Name)
                    .Skip(pageOptions.Offset)
                    .Take(pageOptions.PageSize);

            return await query.ToListAsync();
        }

        public async Task CreateUserFromIdentityUser(string userId)
        {
            var identityUser = await _identityService.GetIdentityUser(userId);
            if (identityUser == null)
            {
                throw new Exception("Identity User is not exists");
            }

            var rolesNames = identityUser.RoleNames.Select(o => o.ToLower()).ToList();
            var roles = await _roleRepository.Roles.Where(o => identityUser.RoleNames.Contains(o.Code)).ToListAsync();
            var userRoles = roles.Select(o => new UserRole() { RoleCode = o.Code, Role = o }).ToList();

            var newUser = new User(userId, identityUser.UserName, identityUser.Email, "");
            newUser.SetRoles(userRoles);

            _userRepository.Add(newUser);
            await _userRepository.SaveChangesAsync();
        }

        public async Task<User> CreateUser(string name, string email, string phone, string createdBy)
        {
            var id = _idGenerator.GenerateNew();
            var user = new User(id, name, email, phone);

            user.CreatedDate = DateTime.Now;
            user.UpdatedDate = DateTime.Now;
            _userRepository.Add(user);

            await _identityService.CreateIdentityUser(user.Id, email.ToLower(), email);

            await _userRepository.SaveChangesAsync();

            //add default roleCode = "member" 
            await this.UpdateUserRoles(user, new List<string> { "member" });

            //Send domainevent UserCreated
            await _bus.Publish(new UserCreated(user, createdBy));
            return user;
        }

        public async Task<User> UpdateUser(User user, string name, string email, string phone, string updatedBy)
        {
            //var roles = await _roleRepository.Roles
            //        .Where(o => roleCodes.Contains(o.Code))
            //        .ToListAsync();
            //var userRoles = roles.Select(o => new UserRole()
            //{
            //    RoleCode = o.Code,
            //    Role = o
            //}).ToList();
            user.Name = name;
            user.Email = email;
            user.Phone = phone;
            //user.SetRoles(userRoles);

            user.UpdatedDate = DateTime.Now;
            _userRepository.Update(user);

            await _identityService.UpdateIdentityUser(user.Id, email.ToLower(), email);
            // await _identityService.UpdateIdentityUserRoles(user.Id, userRoles.Select(o=>o.RoleCode).ToList());

            await _userRepository.SaveChangesAsync();

            //Send domainevent UserUpdated
            await _bus.Publish(new UserUpdated(user, updatedBy));
            return user;
        }

        public async Task<User> UpdateUserRoles(User user, List<string> roleCodes, string updatedBy = null)
        {
            var roles = await _roleRepository.Roles.Where(o => roleCodes.Contains(o.Code)).ToListAsync();

            var userRoles = roles.Select(o => new UserRole() { RoleCode = o.Code, Role= o}).ToList();

            user.SetRoles(userRoles);

            user.UpdatedDate= DateTime.Now;
            _userRepository.Update(user);

            await _identityService.UpdateIdentityUserRoles(user.Id, userRoles.Select(o => o.RoleCode).ToList());
            await _userRepository.SaveChangesAsync();

            //Send domainevent UserUpdated
             await _bus.Publish(new UserUpdated(user, updatedBy));
            return user;
        }

        public async Task Active(User user, bool isActive, string updatedBy = null)
        {
            user.IsActive = isActive;

            _userRepository.Update(user);

            await _identityService.ActiveIdentityUser(user.Id, isActive);

            await _userRepository.SaveChangesAsync();

            //TODO : Send domainevent UserActived
            await _bus.Publish(new UserActived(user, updatedBy));
        }

        public async Task DeleteUser(User user, bool isSelf, string updatedBy )
        {
            _userRepository.Delete(user);

            await _identityService.ActiveIdentityUser(user.Id, isActive: false);

            await _userRepository.SaveChangesAsync();

            //Send domainevent UserDeleted
            await _bus.Publish(new UserDeleted(user, updatedBy));
        }

        public async Task<int> Count(string textSearch)
        {
            var query = _userRepository.Users;

            if (!string.IsNullOrWhiteSpace(textSearch))
            {
                query = query.Where(o => o.Name.Contains(textSearch));
            }

            return await query.CountAsync();
        }

        public async Task<User> GetUserByEmail(string email)
        {
            return await _userRepository.GetUserByEmail(email);
        }
    }
}
