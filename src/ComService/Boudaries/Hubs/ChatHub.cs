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
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using System.Threading;

namespace ComService.Boudaries.Hubs
{
    public class ChatHub : Hub
    {
        const string CallRequest = "call-request";
        const string CallMessage = "call-message";
        private readonly ILogger<ChatHub> _logger;
        private readonly IConversationService _conversationService;
        private readonly IOptionsMonitor<JwtBearerOptions> _jwtBearerOptions;
        public ChatHub(ILogger<ChatHub> logger,
            IOptionsMonitor<JwtBearerOptions> options,
            IConversationService conversationService)
        {
            _logger = logger;
            _jwtBearerOptions = options;
            _conversationService = conversationService;

        }

        private static ConcurrentDictionary<string, string> ConnectionRooms = new ConcurrentDictionary<string, string>();
        private static ConcurrentDictionary<string, IOnlineClient> OnlineClients = new ConcurrentDictionary<string, IOnlineClient>();

        public async Task SendCallMessage(string action, object data)
        {
            IOnlineClient client = OnlineClients.GetOrDefault(Context.ConnectionId);
            if (client == null) return;
            try
            {
                switch (action)
                {
                    case CallSignalingActions.SEND_CALL_REQUEST:
                        {
                            var conversationId = (string)data;
                            var conversation = await _conversationService.Get(conversationId);
                            if (conversation == null) return;

                            //TODO: check the client user must be in the conversation
                            var emitData = CreateEventData(CallRequest, new
                            {
                                room = conversationId,
                                userId = client.UserId,
                                userName = client.UserName
                            });

                            //create room and join
                            ConnectionRooms[this.Context.ConnectionId] = conversationId;
                            await Groups.AddToGroupAsync(this.Context.ConnectionId, $"room_{conversationId}");

                            foreach (var member in conversation.Members)
                            {
                                if (member.UserId != client.UserId)
                                {
                                    _logger.LogInformation($"[ChatHub] emit SEND_CALL_REQUEST to {member.UserId} - {member.UserMember.UserName}");
                                    var clientProxy = Clients.Group($"user_{member.UserId}");
                                    await EmitData(clientProxy, emitData);
                                }
                            }

                        }
                        break;

                    case CallSignalingActions.SEND_CALL_REQUEST_RESPONSE:
                        {
                            var response = (dynamic)data;
                            var conversationId = (string)response.room;
                            var accepted = (bool)response.accepted;
                            //var roomKey = response.roomkey

                            //TODO: check the client user must be in the conversation and have room password
                           
                            var emitData = CreateEventData(CallMessage, new
                            {
                                type = "call-request-response",
                                data = new
                                {
                                    accepted
                                }
                            });

                            if (accepted)
                            {
                                //join group
                                ConnectionRooms[this.Context.ConnectionId] = conversationId;
                                await Groups.AddToGroupAsync(this.Context.ConnectionId, $"room_{conversationId}");
                            }

                            //send to group room
                            _logger.LogInformation($"[ChatHub] emit SEND_CALL_REQUEST_RESPONSE to room ${conversationId}");
                            var clientProxy = Clients.OthersInGroup($"room_{conversationId}");
                            await EmitData(clientProxy, emitData);
                        }
                        break;

                    case CallSignalingActions.SEND_SESSION_DESCRIPTION:
                        {
                            var response = (dynamic)data;
                            var conversationId = (string)response.room;
                            var sdp = response.sdp;


                            //TODO: check the client user must be in the conversation
                            var existConversationId = ConnectionRooms[this.Context.ConnectionId];

                            var emitData = CreateEventData(CallMessage, new
                            {
                                type = "other-session-description",
                                data = sdp
                            });

                            //send to group room
                            _logger.LogInformation($"[ChatHub] emit SEND_SESSION_DESCRIPTION to room ${conversationId}");
                            var clientProxy = Clients.OthersInGroup($"room_{conversationId}");
                            await EmitData(clientProxy, emitData);

                        }
                        break;
                    case CallSignalingActions.SEND_ICE_CANDIDATE:
                        {
                            var response = (dynamic)data;
                            var conversationId = (string)response.room;
                            var iceCandidate = response.iceCandidate;

                            //find clients by room
                            var emitData = CreateEventData(CallMessage, new
                            {
                                type = "other-ice-candidate",
                                data = iceCandidate
                            });

                            //send to group room
                            _logger.LogInformation($"[ChatHub] emit SEND_ICE_CANDIDATE to room ${conversationId}");
                            var clientProxy = Clients.OthersInGroup($"room_{conversationId}");
                            await EmitData(clientProxy, emitData);
                        }
                        break;
                    case CallSignalingActions.SEND_HANG_UP:
                        {
                            //data is room
                            var conversationId = (string)data;

                            var emitData = CreateEventData(CallMessage, new
                            {
                                type = "other-hangup",
                            });

                            //leave room
                            var isRemovedRoom = ConnectionRooms.TryRemove(Context.ConnectionId, out var _);
                            await Groups.RemoveFromGroupAsync(this.Context.ConnectionId, $"room_{conversationId}");

                            //send to group room
                            _logger.LogInformation($"[ChatHub] emit SEND_HANG_UP to room ${conversationId}");
                            var clientProxy = Clients.OthersInGroup($"room_{conversationId}");
                            await EmitData(clientProxy, emitData);
                        }
                        break;
                }
            }catch(Exception ex)
            {
                _logger.LogError(ex, $"[ChatHub] Error on action {action}");
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


        private OpenIdConnectConfiguration _configuration;
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

            var nameClaim = claims.FirstOrDefault(x => x.Type == "name");// JwtClaimTypes.Name);

            var expirTime = jwtToken.ValidTo - jwtToken.ValidFrom;
            if (expirTime.TotalSeconds <= 0)
            {
                return "";
            }
            try
            {
                // https://www.c-sharpcorner.com/article/custom-authentication-validate-jwt-token-in-net-core/
                var options = _jwtBearerOptions.Get("Bearer");
                if (_configuration == null && options.ConfigurationManager != null)
                {
                    _configuration = await options.ConfigurationManager.GetConfigurationAsync(CancellationToken.None);
                }


                var validationParameters = options.TokenValidationParameters.Clone();
                validationParameters.IssuerSigningKeys = _configuration.SigningKeys;
                ClaimsPrincipal principal = jwtHandler.ValidateToken(accessToken, validationParameters, out var securityToken);

                //ClaimsPrincipal principal = new ClaimsPrincipal(new ClaimsIdentity(claims));

                var httpContext = this.Context.GetHttpContext();
                var user = httpContext.User;
                httpContext.User = principal;

                //add user to user group
                await Groups.AddToGroupAsync(this.Context.ConnectionId, $"user_{userId}");
                OnlineClients[this.Context.ConnectionId] =
                    new OnlineClient()
                    {
                        ConnectionId = this.Context.ConnectionId,
                        UserId = userId.ToString(),
                        UserName = nameClaim?.Value ?? userId.ToString()
                    };
                return userId.ToString();
            }
            catch (Exception ex)
            {
                return string.Empty;
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
            var isRemovedUser = OnlineClients.TryRemove(Context.ConnectionId, out var client);
            if (isRemovedUser)
            {
                await Groups.RemoveFromGroupAsync(this.Context.ConnectionId, $"user_{client.UserId}");
            }
            //TODO: get room that the user joined, then Emit user disconnected
            var isRemovedRoom = ConnectionRooms.TryRemove(Context.ConnectionId, out var conversationId);
            if (isRemovedRoom)
            {
                await Groups.RemoveFromGroupAsync(this.Context.ConnectionId, $"room_{conversationId}");
            }
        }
    }
}
