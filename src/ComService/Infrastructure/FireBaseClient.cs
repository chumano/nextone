using ComService.Helpers;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using NextOne.Shared.Extenstions;
using System.IO;
using System.Text;
using ComService.Infrastructure.AppSettings;
using Microsoft.Extensions.Options;

namespace ComService.Infrastructure
{
    public class FireBaseClient
    { 
        private readonly string _keyFilePath;
        private readonly int _sendBatchMessageNumber = 100; //số thiết bị trong 1 group
        private readonly ILogger<FireBaseClient> _logger;
        public FireBaseClient(ILogger<FireBaseClient> logger, IOptions<FireBaseOptions> options)
        {
            try
            {
                _logger = logger;
                _keyFilePath = options.Value.KeyPath;
                _sendBatchMessageNumber = options.Value.SendBatchMessageNumber;

                _logger.LogDebug($"[FireBaseClient][Setup] {_keyFilePath}");

                var filekeyjson = ReadKeyFile();
                var defaultApp = FirebaseApp.Create(new AppOptions()
                {
                    Credential = GoogleCredential.FromJson(filekeyjson)
                });

                var defaultAuth = FirebaseAuth.DefaultInstance;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[FireBaseClient][Setup] {ex.Message}");
            }
        }

        public async Task SendMessage(IList<string> tokens, MulticastMessage message)
        {
            _logger.LogInformation("FileBaseClient- SendMessage-Tokens: "
                    + string.Join(",", tokens)
                    + JsonConvert.SerializeObject(message));
            var listTokenEnumerable = tokens.ToList().SplitList(_sendBatchMessageNumber);
            _logger.LogInformation("FileBaseClient- SendMessage-Count: " + listTokenEnumerable.Count());
            foreach (var list in listTokenEnumerable)
            {
                message.Tokens = list;


                _logger.LogInformation("FileBaseClient- SendMessage: "
                    + string.Join(",", list)
                    + JsonConvert.SerializeObject(message));
                var response = await FirebaseMessaging.DefaultInstance.SendMulticastAsync(message);
                if(response.FailureCount > 0)
                {
                    _logger.LogError("FileBaseClient- SendMessage: " + JsonConvert.SerializeObject(response.Responses));
                }
            }
        }


        public async Task<string> TestMessage(string token)
        {
            var message = new Message()
            {
                Notification = new Notification() { Title ="Ucom" , Body="Test"},
                Token = token
            };
            return await FirebaseMessaging.DefaultInstance.SendAsync(message, true);
        }
        public async Task SendMessage(string token, Dictionary<string, string> data)
        {
            var message = new Message()
            {
                Data = data,
                Token = token,
            };

            string response = await FirebaseMessaging.DefaultInstance.SendAsync(message);
        }

        public async Task SendMessageTopic(string topic, Dictionary<string, string> data)
        {
            // The topic name can be optionally prefixed with "/topics/".
            var message = new Message()
            {
                Data = data,
                Topic = topic,
            };

            string response = await FirebaseMessaging.DefaultInstance.SendAsync(message);
            // Response is a message ID string.
        }


        public async Task SubscribeTokens(List<string> deviceTokens, string topic)
        {
            var response = await FirebaseMessaging.DefaultInstance
                    .SubscribeToTopicAsync(deviceTokens, topic);

            if (response.SuccessCount > 0)
            {

            }
            else
            {
                //check error
                foreach (var err in response.Errors)
                {
                    //err.Index
                    //err.Reason
                }
            }
        }

        public async Task UnsubscribeTokens(List<string> deviceTokens, string topic)
        {
            var response = await FirebaseMessaging.DefaultInstance
                    .UnsubscribeFromTopicAsync(deviceTokens, topic);

            if (response.SuccessCount > 0)
            {
            }
            else
            {
                //check error
                foreach (var err in response.Errors)
                {
                    //err.Index
                    //err.Reason
                }
            }
        }

        public async Task<FirebaseToken> VerifyIdToken(string idToken)
        {
            try
            {
                if (FirebaseAuth.DefaultInstance == null)
                {
                    throw new Exception("FirebaseAuth.DefaultInstance is null");
                }

                FirebaseToken decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);
                if (decodedToken == null)
                {
                    throw new Exception("decodedToken is null");
                }

               _logger.LogDebug($"[FireBaseClient][VerifyIdToken] {idToken} decodedToken {JsonConvert.SerializeObject(decodedToken)}");

                string uid = decodedToken.Uid;
                return decodedToken;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[FireBaseClient][VerifyIdToken] {ex.Message}");
            }
            return null;
        }

        private string ReadKeyFile()
        {
            if (!File.Exists(_keyFilePath))
            {
                throw new Exception($"{_keyFilePath} does not exist");
            }
            using(var stream = File.OpenRead(_keyFilePath))
            {
                using (var reader = new StreamReader(stream, Encoding.UTF8))
                    return reader.ReadToEnd();
            }
           
        }
    }

}
