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
using NextOne.Shared.Bus;
using ComService.Domain.DomainEvents;
using Newtonsoft.Json;
using ComService.Domain;
using ComService.Infrastructure.AppSettings;
using NextOne.Shared.Common;

namespace ComService.Boudaries.Hubs
{
    public class ChatHub : Hub
    {
        const string CallRequest = "call-request";
        const string CallMessage = "call-message";
        private readonly ILogger<ChatHub> _logger;
        private readonly IConversationService _conversationService;
        private readonly IUserStatusService _userStatusService;
        private readonly IOptionsMonitor<JwtBearerOptions> _jwtBearerOptions;
        private readonly IOptions<FireBaseOptions> _fireBaseOptions;
        private readonly IdGenerator _idGenerator;
        protected readonly IBus _bus;
        public ChatHub(ILogger<ChatHub> logger,
            IOptionsMonitor<JwtBearerOptions> options,
            IOptions<FireBaseOptions> fireBaseOptions,
            IConversationService conversationService,
            IUserStatusService userStatusService,
            IdGenerator idGenerator,
            IBus bus)
        {
            _logger = logger;
            _jwtBearerOptions = options;
            _fireBaseOptions= fireBaseOptions;
            _conversationService = conversationService;
            _userStatusService = userStatusService;
            _idGenerator = idGenerator;
            _bus = bus;
        }

        private static ConcurrentDictionary<string, string> ConnectionRooms = new ConcurrentDictionary<string, string>();
        private static ConcurrentDictionary<string, IOnlineClient> OnlineClients = new ConcurrentDictionary<string, IOnlineClient>();
        private static ConcurrentDictionary<string, CallRoomState> CallRoomState = new ConcurrentDictionary<string, CallRoomState>();

        private const int CALL_TIMEOUT_IN_SECONDS = 30;
        public async Task<string> SendCallMessage(string action, object data)
        {
            var Now = DateTime.Now;
            IOnlineClient client = OnlineClients.GetOrDefault(Context.ConnectionId);
            if (client == null) return "IOnlineClient is null";
            try
            {
                _logger.LogInformation($"[ChatHub] SendCallMessage {action} - data: {JsonConvert.SerializeObject(data)}");
                switch (action)
                {
                    case CallSignalingActions.SEND_CALL_REQUEST:
                        {
                            var response = (dynamic)data;
                            var conversationId = (string)response.room;
                            var callType = (string)response.callType;
                            var conversation = await _conversationService.Get(conversationId);
                            if (conversation == null) return "Conversation is null";

                            var callRoomState = CallRoomState.GetOrDefault(conversationId);
                            if(callRoomState == null)
                            {
                                //start new call state
                                callRoomState = new CallRoomState()
                                {
                                    ConversationId = conversationId,
                                    SenderId = client.UserId,
                                    SenderName = client.UserName,
                                    State = CallStateEnum.Requesting,
                                    RequestDate = Now,
                                };
                                CallRoomState.AddOrUpdate(conversationId, callRoomState, (string key, CallRoomState oldState) =>
                                {
                                    return callRoomState;
                                });
                            }
                            else
                            {
                                var isOldRequestTimeout = false;
                                //Kiểm tra call time out không
                                if(callRoomState.State == CallStateEnum.Requesting)
                                {
                                    //Mình request khi người khác cũng đang request
                                    var dif = Now - callRoomState.RequestDate;
                                    if (dif < TimeSpan.FromSeconds(CALL_TIMEOUT_IN_SECONDS))
                                    {
                                        _logger.LogInformation("CALL_ERROR: Other is requesting :"
                                            + JsonConvert.SerializeObject(callRoomState));
                                        //Không cho gọi nữa
                                        return "Other is requesting";
                                    }

                                    isOldRequestTimeout = true;
                                }

                                //Đang call rồi thì không có call nữa
                                if (!isOldRequestTimeout) {
                                   if(callRoomState.State != CallStateEnum.End)
                                    {
                                        _logger.LogInformation("CALL_ERROR: Đang call rồi thì không có call nữa :"
                                            + JsonConvert.SerializeObject(callRoomState));
                                        //TODO: ChatHub tạo message cuộc gọi nhỡ
                                        return "Calling: " + Enum.GetName(typeof(CallStateEnum), callRoomState.State)
                                            + " at " + callRoomState.RequestDate.ToString();
                                    }
                                }
                            }

                            //TODO: check the client user must be in the conversation
                            var emitData = CreateEventData(CallRequest, new
                            {
                                room = conversationId,
                                userId = client.UserId,
                                userName = client.UserName,
                                callType = callType,
                                requestDate = Now.ToString(),
                            });

                            //TODO: ChatHub tạo message yêu cầu cuộc gọi
                            var messageId = _idGenerator.GenerateNew();
                            await _conversationService.AddMessage(conversation, new Message(messageId, MessageTypeEnum.CallMessage, client.UserId, "Cuộc gọi bắt đầu"));

                            //create room and join
                            ConnectionRooms[this.Context.ConnectionId] = conversationId;
                            await Groups.AddToGroupAsync(this.Context.ConnectionId, $"room_{conversationId}");
                            _logger.LogInformation($"[ChatHub] emit SEND_CALL_REQUEST to room_{conversationId} - members: {conversation.Members.Count}");
                            foreach (var member in conversation.Members)
                            {
                                if (member.UserId != client.UserId)
                                {
                                    _logger.LogInformation($"[ChatHub] emit SEND_CALL_REQUEST to {member.UserId} - {member.UserMember.UserName}");
                                    var clientProxy = Clients.Group($"user_{member.UserId}");
                                    await EmitData(clientProxy, emitData);


                                    if (_fireBaseOptions.Value.Enabled)
                                    {
                                        //send cloud message request
                                        await _bus.Publish(new CloudCallRequetEvent()
                                        {
                                            ConversationId = conversationId,
                                            UserSenderId = client.UserId,
                                            UserReceiverId = member.UserId,
                                            CallType = callType,
                                            RequestDate = Now
                                        });
                                    }
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
                            var callRoomState = CallRoomState.GetOrDefault(conversationId);
                            if (callRoomState == null)
                            {
                                //không có trạng thái thì thôi, tức là đã hangup rồi
                                _logger.LogInformation("CALL_ERROR: CallState is null");
                                return "CallState is null";
                            }
                            else
                            {
                                //Đang call rồi thì không có call nữa
                                if(callRoomState.State != CallStateEnum.Requesting)
                                {
                                    _logger.LogInformation("CALL_ERROR: Not requesting :"
                                      + JsonConvert.SerializeObject(callRoomState));
                                    return "Not requesting";
                                }

                                if (callRoomState.State == CallStateEnum.Requesting)
                                {
                                    var dif = Now - callRoomState.RequestDate;
                                    if (dif >= TimeSpan.FromSeconds(CALL_TIMEOUT_IN_SECONDS))
                                    {
                                        _logger.LogInformation("CALL_ERROR: Call is timeout :"
                                            + JsonConvert.SerializeObject(callRoomState));
                                        //Không cho gọi nữa
                                        return "Call is timeout";
                                    }
                                }

                                if (accepted)
                                {
                                    //TODO: ChatHub tạo message cuộc gọi đang tiến hành
                                    callRoomState.State = CallStateEnum.Calling;
                                    CallRoomState.AddOrUpdate(conversationId, callRoomState, (string key, CallRoomState oldState) =>
                                    {
                                        return callRoomState;
                                    });
                                }
                                else
                                {
                                    var conversation = await _conversationService.Get(conversationId);
                                    if (conversation == null)
                                    {

                                        _logger.LogInformation("CALL_ERROR: Conversation is null :"
                                            + JsonConvert.SerializeObject(callRoomState));
                                        return "Conversation is null";
                                    }
                                    callRoomState.State = CallStateEnum.End;
                                    CallRoomState.Remove(conversationId, out _);
                                    var messageId = _idGenerator.GenerateNew();
                                    await _conversationService.AddMessage(conversation, new Message(messageId, MessageTypeEnum.CallEndMessage, client.UserId, "Cuộc gọi bị từ chối"));
                                }
                            }

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

                    case CallSignalingActions.SEND_HANG_UP:
                        {
                            //data is room
                            var conversationId = (string)data;
                            var conversation = await _conversationService.Get(conversationId);
                            if (conversation == null) return "Conversation is null";

                            var callRoomState = CallRoomState.GetOrDefault(conversationId);
                            if (callRoomState != null)
                            {
                                CallRoomState.Remove(conversationId, out _);
                                //TODO: ChatHub tạo message cuộc gọi kết thúc
                                var messageId = _idGenerator.GenerateNew();
                                await _conversationService.AddMessage(conversation, new Message(messageId, MessageTypeEnum.CallEndMessage, client.UserId, "Cuộc gọi kết thúc"));
                            }

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

                }
            }catch(Exception ex)
            {
                _logger.LogError(ex, $"[ChatHub] Error on action {action}");
                return "Unknown Error";
            }

            return "";
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

                UserStatus userStatus = null;

                //get user name
                try
                {
                    userStatus = await _userStatusService.GetUser(userId.ToString());
                }
                catch { }
               
                var onlineClient =  new OnlineClient()
                    {
                        ConnectionId = this.Context.ConnectionId,
                        UserId = userId.ToString(),
                        UserName = userStatus?.UserName ?? nameClaim?.Value ?? userId.ToString()
                    };

                OnlineClients[this.Context.ConnectionId] = onlineClient;

                
                //Update user Online
                await _bus.Publish(new UserOnlineEvent()
                {
                    UserId = onlineClient.UserId,
                    UserName = onlineClient.UserName,
                    IsOnline = true
                });
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
            try
            {
                await base.OnDisconnectedAsync(exception);
                var isRemovedUser = OnlineClients.TryRemove(Context.ConnectionId, out var client);
                if (isRemovedUser)
                {
                    await Groups.RemoveFromGroupAsync(this.Context.ConnectionId, $"user_{client.UserId}");
                }

                //get room that the user joined, then Emit user disconnected
                var isRemovedRoom = ConnectionRooms.TryRemove(Context.ConnectionId, out var conversationId);
                if (isRemovedRoom)
                {
                    var conversation = await _conversationService.Get(conversationId);
                    if (conversation == null) return;
                    var messageId = _idGenerator.GenerateNew();
                    await _conversationService.AddMessage(conversation, new Message(messageId, MessageTypeEnum.CallEndMessage, client.UserId, "Cuộc gọi kết thúc"));

                    await Groups.RemoveFromGroupAsync(this.Context.ConnectionId, $"room_{conversationId}");
                    CallRoomState.Remove(conversationId, out _);
                }

                //TODO: Update user Offline
                if (client != null)
                {
                    await _bus.Publish(new UserOnlineEvent()
                    {
                        UserId = client.UserId,
                        UserName = client.UserName,
                        IsOnline = false
                    });
                }
            }catch(Exception ex)
            {
                _logger.LogError(ex, "ChatHub OnDisconnectedAsync error: " + ex.Message);
            }
         
        }
    }
}
