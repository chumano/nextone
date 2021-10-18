﻿using IdentityServer4.Events;
using IdentityServer4.Services;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IdentityService.Services
{
    public class IdentityEventSink : IEventSink
    {
        private readonly ILogger<IdentityEventSink> _logger;

        public IdentityEventSink(ILogger<IdentityEventSink>  logger)
        {
            _logger = logger;
        }

        public Task PersistAsync(Event evt)
        {
            if (evt.EventType == EventTypes.Success ||
                evt.EventType == EventTypes.Information)
            {
                _logger.LogInformation("{Name} ({Id}), Details: {@details}",
                    evt.Name,
                    evt.Id,
                    evt);
            }
            else
            {
                _logger.LogError("{Name} ({Id}), Details: {@details}",
                    evt.Name,
                    evt.Id,
                    evt);
            }

            return Task.CompletedTask;
        }

        /*
         * http://docs.identityserver.io/en/latest/topics/events.html
        Built-in events
        The following events are defined in IdentityServer:

        ApiAuthenticationFailureEvent & ApiAuthenticationSuccessEvent
            Gets raised for successful/failed API authentication at the introspection endpoint.
        ClientAuthenticationSuccessEvent & ClientAuthenticationFailureEvent
            Gets raised for successful/failed client authentication at the token endpoint.
        TokenIssuedSuccessEvent & TokenIssuedFailureEvent
            Gets raised for successful/failed attempts to request identity tokens, access tokens, refresh tokens and authorization codes.
        TokenIntrospectionSuccessEvent & TokenIntrospectionFailureEvent
            Gets raised for successful token introspection requests.
        TokenRevokedSuccessEvent
            Gets raised for successful token revocation requests.
        UserLoginSuccessEvent & UserLoginFailureEvent
            Gets raised by the quickstart UI for successful/failed user logins.
        UserLogoutSuccessEvent
            Gets raised for successful logout requests.
        ConsentGrantedEvent & ConsentDeniedEvent
            Gets raised in the consent UI.
        UnhandledExceptionEvent
            Gets raised for unhandled exceptions.
        DeviceAuthorizationFailureEvent & DeviceAuthorizationSuccessEvent
            Gets raised for successful/failed device authorization requests.
        */
    }
}
