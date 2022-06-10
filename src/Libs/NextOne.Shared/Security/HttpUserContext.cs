using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Text;

namespace NextOne.Shared.Security
{
    internal class BasicUser : IUser
    {
        public string UserId { get; set; }

        public string Name { get; set; }
    }
    public class HttpUserContext : IUserContext
    {
        public const string AnonymousUserId = "AnonymousUserId";

        private readonly IHttpContextAccessor _httpContextAccessor;
        public HttpUserContext(IHttpContextAccessor httpContextAccessor,
            IHttpClientFactory httpClientFactory,
            ILogger<HttpUserContext> logger)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        public bool IsAuthenticated
        {
            get
            {
                var user = _httpContextAccessor.HttpContext.User;
                return user?.Identity?.IsAuthenticated ?? false;
            }
        }
    

        public IUser User
        {
            get
            {
                var user = _httpContextAccessor.HttpContext.User;
                var claimId = user?.FindFirst(ClaimTypes.NameIdentifier);
                var claimName = user?.FindFirst("name");
                return new BasicUser()
                {
                    UserId = claimId?.Value ?? AnonymousUserId,
                    Name = claimName?.Value ?? ""
                };
            }
        }

        public IList<string> UserRoles
        {
            get
            {
                var user = _httpContextAccessor.HttpContext.User;
                var roles = user?.FindAll(ClaimTypes.Role)?.Select(x => x.Value)?.ToList();
                return roles;
            }
        }
        public string IpAddress
        {
            get
            {
                var connection = _httpContextAccessor.HttpContext.Connection;
                var ipAddress = connection?.RemoteIpAddress?.ToString();
                return ipAddress ?? System.Net.IPAddress.None.ToString();
            }
        }
    }
}
