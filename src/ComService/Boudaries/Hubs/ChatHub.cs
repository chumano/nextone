using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ComService.Boudaries.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ILogger<ChatHub> _logger;
        public ChatHub(Logger<ChatHub> logger)
        {
            _logger = logger;
           
        }

        public async Task Register(string accessToken)
        {
            var jwtHandler = new JwtSecurityTokenHandler();
            var jwtToken = jwtHandler.ReadJwtToken(accessToken);
            if (jwtToken == null)
            {
                return;
            }
            var claims = jwtToken.Claims;
            if (claims == null || !claims.Any())
            {
                return;
            }
           
            Guid.TryParse(claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value, out var userId);
            if (userId == Guid.Empty )
            {
                return;
            }

            var expirTime = jwtToken.ValidTo - jwtToken.ValidFrom;
            if (expirTime.TotalSeconds <= 0)
            {
                return;
            }
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }
        //
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
        }
    }
}
