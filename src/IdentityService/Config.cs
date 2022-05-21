// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using IdentityServer4.Models;
using IdentityService.Data;
using IdentityService.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;

namespace IdentityService
{
    public static class Config
    {
        public static IEnumerable<ApplicationSystem> Systems => new ApplicationSystem[]
        {
           new ApplicationSystem()
           {
               Code = "NextOne",
               Name = "Next One",
               Pages = new List<ApplicationPage>()
               {
                    new ApplicationPage()
                    {
                        SystemCode = "NextOne",
                        Name = "UCom",
                        Url = "http://nextone.local"
                    },
                    new ApplicationPage()
                    {
                        SystemCode = "NextOne",
                        Name = "Map",
                        Url = "http://map.nextone.local"
                    }
               }
           }
        };

        public static IEnumerable<ApplicationRole> Roles => new ApplicationRole[]
        {
           new ApplicationRole()
           {
               Name = "admin",
               DisplayName="Administrator",
               NormalizedName = "ADMIN"
           },
           new ApplicationRole()
           {
               Name = "manager",
               DisplayName="Manager",
               NormalizedName = "MANAGER"
           },
           new ApplicationRole()
           {
               Name = "member",
               DisplayName="Member",
               NormalizedName = "MEMBER"
           }
        };

        public static IEnumerable<ApplicationUser> Users
        {
            get
            {
                var admin = new ApplicationUser()
                {
                    Id = "afbd3f0a-a999-4b67-a8c7-1a4a19347507",
                    UserName = "admin",
                    Email = "admin@nomail.com",
                    LockoutEnabled = false,
                    PhoneNumber = "1234567890",
                    ApplicationSystem = "NextOne"
                };
                //PasswordHasher<ApplicationUser> passwordHasher = new PasswordHasher<ApplicationUser>();
                //passwordHasher.HashPassword(admin, "Nextone@123");

                var manager = new ApplicationUser()
                {
                    Id = "05d5ce08-6a51-4c90-9f73-163e2bb136ee",
                    UserName = "manager",
                    Email = "manager@nomail.com",
                    LockoutEnabled = false,
                    PhoneNumber = "1234567890",
                    ApplicationSystem = "NextOne"
                };

                var member = new ApplicationUser()
                {
                    Id = "5b256826-3074-4ce6-bb0a-bc6d2885e274",
                    UserName = "member",
                    Email = "member@nomail.com",
                    LockoutEnabled = false,
                    PhoneNumber = "1234567890",
                    ApplicationSystem = "NextOne"
                };

                var users = new ApplicationUser[]
                {
                   admin, manager, member
                };
                return users;
            }
        }

        //RequestedClaims phải thuộc IdentityResource thì mới claims mới được trả về clients
        public static IEnumerable<IdentityResource> IdentityResources =>
            new IdentityResource[]
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                new IdentityResource( "role", "Your business user role", new string[] {"role", "group"})
                {
                    Required = true
                }
            };

        public static IEnumerable<ApiScope> ApiScopes =>
            new ApiScope[]
            {
                new ApiScope("scope1"),
                new ApiScope("scope2"),
                new ApiScope("gateway"),
                new ApiScope("master-scope", new string[] {"role"})
            };

        public static IEnumerable<ApiResource> ApiResources =>
                  new ApiResource[]
                  {
                        new ApiResource(){ Name = "gateway", ShowInDiscoveryDocument =false,DisplayName="Gateway api resource", Enabled= true, 
                            Scopes = new List<string>{"gateway"} //scope được lấy từ ApiScopes
                        },
                  };

        public static IEnumerable<Client> Clients =>
            new Client[]
            {
                // m2m client credentials flow client
                new Client
                {
                    ClientId = "m2m.client",
                    ClientName = "Client Credentials Client",

                    AllowedGrantTypes = GrantTypes.ClientCredentials,
                    ClientSecrets = { new Secret("511536EF-F270-4058-80CA-1C89C192F69A".Sha256()) },

                    AllowedScopes = { "scope1" },
                    AccessTokenLifetime = 1*24*60*60  //1 ngay
                },

                // interactive client using code flow + pkce
                new Client
                {
                    ClientId = "web-spa",
                    ClientName = "Web App",
                    ClientSecrets = { new Secret("49C1A7E1-0C79-4A89-A3D6-A37998FB86B0".Sha256()) },
                    RequireClientSecret = false,

                    AlwaysIncludeUserClaimsInIdToken = true,
                    AlwaysSendClientClaims = false,

                    AllowedGrantTypes = GrantTypes.Code,

                    RedirectUris = { "https://localhost:5100/auth/callback" , "http://localhost:5100/auth/callback", "http://nextone.local/auth/callback"},
                    FrontChannelLogoutUri = "http://localhost:5100/auth/signout",
                    PostLogoutRedirectUris = { "https://localhost:5100/auth/signout-callback", "http://localhost:5100/auth/signout-callback" , "http://nextone.local/auth/signout-callback"},

                    AllowOfflineAccess = true,
                    AllowedScopes = { "openid", "profile", "role", "gateway", "master-scope" },
                    AccessTokenLifetime = 2*60*60  //1 hour
                },

                new Client
                {
                    ClientId = "web-map-spa",
                    ClientName = "Web Map App",
                    ClientSecrets = { new Secret("49C1A7E1-0C79-4A89-A3D6-A37998FB86B0".Sha256()) },
                    RequireClientSecret = false,

                    AlwaysIncludeUserClaimsInIdToken = true,
                    AlwaysSendClientClaims = false,

                    AllowedGrantTypes =  GrantTypes.Code.Concat(GrantTypes.ResourceOwnerPassword).ToList(),

                    RedirectUris = { "https://localhost:5107/auth/callback" , "http://localhost:5107/auth/callback", "http://map.nextone.local/auth/callback"},
                    FrontChannelLogoutUri = "http://localhost:5107/auth/signout",
                    PostLogoutRedirectUris = { "https://localhost:5107/auth/signout-callback", "http://localhost:5107/auth/signout-callback", "http://map.nextone.local/auth/signout-callback" },

                    AllowOfflineAccess = true,
                    AllowedScopes = { "openid", "profile", "role", "gateway", "master-scope" },
                    AccessTokenLifetime = 2*60*60  //1 hour
                },

                 new Client
                {
                    ClientId = "postman",
                    ClientName = "Postman",
                    ClientSecrets = { new Secret("49C1A7E1-0C79-4A89-A3D6-A37998FB86B0".Sha256()) },
                    RequireClientSecret = false,
                    RequirePkce = false,

                    AllowedGrantTypes = GrantTypes.Code,

                    RedirectUris = { "https://www.getpostman.com/oauth2/callback", "https://oauth.pstmn.io/v1/callback" },
                    FrontChannelLogoutUri = "",
                    PostLogoutRedirectUris = { },

                    AllowOfflineAccess = false,
                    AllowedScopes = { "openid", "profile", "role", "gateway", "master-scope" },
                    AccessTokenLifetime = 30*24*60*60   //30 days
                },

                  new Client
                {
                    ClientId = "native-app",
                    ClientName = "Native app",
                    ClientSecrets = { new Secret("49C1A7E1-0C79-4A89-A3D6-A37998FB86B0".Sha256()) },
                    RequireClientSecret = false,
                    RequirePkce = false,

                    AllowedGrantTypes = GrantTypes.ResourceOwnerPassword,

                    AllowOfflineAccess = true,
                    AllowedScopes = { "openid", "profile", "role", "gateway", "master-scope" },
                    AccessTokenLifetime = 14*24*60*60  //4 ngay
                },
            };
    }
}
