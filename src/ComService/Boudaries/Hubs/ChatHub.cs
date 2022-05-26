using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using NextOne.Shared.Extenstions;
using ComService.Domain.Services;

namespace ComService.Boudaries.Hubs
{
    public class ChatHub : Hub
    {
        const string CallRequest = "call-request";
        const string CallMessage = "call-message";
        private readonly ILogger<ChatHub> _logger;
        private readonly IConversationService _conversationService;
        public ChatHub(ILogger<ChatHub> logger, IConversationService conversationService)
        {
            _logger = logger;
            _conversationService = conversationService;

        }
        public static Dictionary<string, List<string>> ConnectedClients = new Dictionary<string, List<string>>();
        private static ConcurrentDictionary<string, IOnlineClient> OnlineClients = new ConcurrentDictionary<string, IOnlineClient>();

        public async Task SendCallMessage(string action, object data)
        {
            IOnlineClient client = OnlineClients.GetOrDefault(Context.ConnectionId);
            if(client == null) return;

            switch (action)
            {
                case CallSignalingActions.SEND_CALL_REQUEST:
                    {
                        //data is room (conversationid)
                        //find users in conversationid by receiver

                        var conversationId = (string)data;
                        var conversation = await _conversationService.Get(conversationId);
                        if(conversation == null) return;
                        var memberIds = conversation.Members.Select(o=>o.UserId);

                        var emitData = CreateEventData(CallRequest, new
                        {
                            room = conversationId,
                            userId = client.UserId,
                            userName = client.UserName
                        });

                        foreach(var memberId in memberIds)
                        {
                            if (memberId != client.UserId)
                            {
                                var clientProxy = Clients.Group($"user_{memberId}");
                                await EmitData(clientProxy, emitData);
                            }
                        }
                        
                    }
                    break;

                case CallSignalingActions.SEND_CALL_REQUEST_RESPONSE:
                    {
                        //data is room, accepted
                        var response = (dynamic)data;
                        var room = response.room;
                        var accepted = response.accepted;

                        //find clients by room
                        var emitData = CreateEventData(CallMessage, new
                        {
                            type = "call-request-response",
                            data = new
                            {
                                accepted
                            }
                        });
                        await EmitData(Clients.Others, emitData);
                    }
                    break;
                case CallSignalingActions.SEND_SESSION_DESCRIPTION:
                    {
                        //data is room, sdp
                        var sdp = data;
                        //find clients by room
                        var emitData = CreateEventData(CallMessage, new
                        {
                            type = "other-session-description",
                            data = sdp
                        });
                        await EmitData(Clients.Others, emitData);
                    }
                    break;
                case CallSignalingActions.SEND_ICE_CANDIDATE:
                    {
                        //data is room, ice-candidate
                        var iceCandidate = data;
                        //find clients by room
                        var emitData = CreateEventData(CallMessage, new
                        {
                            type = "other-ice-candidate",
                            data = iceCandidate
                        });
                        await EmitData(Clients.Others, emitData);
                    }
                    break;
                case CallSignalingActions.SEND_HANG_UP:
                    {
                        //data is room
                        //find clients by room
                        var emitData = CreateEventData(CallMessage, new
                        {
                            type = "other-hangup",
                        });
                        await EmitData(Clients.Others, emitData);
                    }
                    break;
            }
        }

        private object CreateEventData(string eventKey, object eventData)
        {
            return new
            {
                eventKey = eventKey,
                eventData = eventData
            };
        }
        private async Task EmitData(IClientProxy clientProxy, object data)
        {
            await clientProxy.SendAsync("data", data);
        }



        public async Task<string> Register(string accessToken)
        {
            var jwtHandler = new JwtSecurityTokenHandler();
            var jwtToken = jwtHandler.ReadJwtToken(accessToken);
            if (jwtToken == null)
            {
                return "";
            }
            var claims = jwtToken.Claims;
            if (claims == null || !claims.Any())
            {
                return "";
            }

            Guid.TryParse(claims.FirstOrDefault(x => x.Type == "sub")?.Value, out var userId);
            if (userId == Guid.Empty)
            {
                return "";
            }

            var expirTime = jwtToken.ValidTo - jwtToken.ValidFrom;
            if (expirTime.TotalSeconds <= 0)
            {
                return "";
            }

            //ClaimsPrincipal principal = jwtHandler.ValidateToken(accessToken, new TokenValidationParameters
            //{
            //    ValidateIssuerSigningKey = false,
            //    ValidateIssuer = false,
            //    ValidateAudience = false,
            //    ValidateLifetime = false
            //},out var securityToken);

            ClaimsPrincipal principal = new ClaimsPrincipal(new ClaimsIdentity(claims));


            var httpContext = this.Context.GetHttpContext();
            var user = httpContext.User;
            httpContext.User = principal;

            //add user to user group
            await Groups.AddToGroupAsync(this.Context.ConnectionId, $"user_{userId}");
            OnlineClients[this.Context.ConnectionId] =
                new OnlineClient() { 
                    ConnectionId = this.Context.ConnectionId, 
                    UserId = userId.ToString(),
                    UserName = userId.ToString()
                };
            return userId.ToString();
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }
        //
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
            IOnlineClient client = OnlineClients.GetOrDefault(Context.ConnectionId);
            if (client == null) return;
            await Groups.RemoveFromGroupAsync(this.Context.ConnectionId, $"user_{client.UserId}");
        }
    }
}
