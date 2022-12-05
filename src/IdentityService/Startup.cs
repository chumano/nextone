// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using IdentityServer4;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication;
using System.Reflection;
using IdentityService.Models;
using IdentityService.Data;
using IdentityServer4.Services;
using IdentityServer4.AspNetIdentity;
using IdentityService.Services;
using IdentityService.Boundaries.Grpc;
using NextOne.Shared.Security;
using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.HttpOverrides;

namespace IdentityService
{
    public class Startup
    {
        private string AllowSpecificOrigins = "AllowSpecificOrigins";
        public IWebHostEnvironment Environment { get; }
        public IConfiguration Configuration { get; }

        public Startup(IWebHostEnvironment environment, IConfiguration configuration)
        {
            //IdentityServer4.Models.GrantTypes.Hybrid;
            Environment = environment;
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();

            var migrationsAssembly = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;
            var connectionString = Configuration.GetConnectionString("DefaultConnection");


            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(connectionString);
                options.EnableDetailedErrors(true);
                options.EnableSensitiveDataLogging(true);

            });

            var identityBuilder = services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
                {
                  // Lockout settings
                  // options.Lockout = Configuration.GetValue<LockoutOptions>("IdentityServiceOptions:Lockout");
              })
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddSignInManager()
                .AddDefaultTokenProviders();

            var builder = services.AddIdentityServer(options =>
            {
                options.Events.RaiseErrorEvents = true;
                options.Events.RaiseInformationEvents = true;
                options.Events.RaiseFailureEvents = true;
                options.Events.RaiseSuccessEvents = true;

               // see https://identityserver4.readthedocs.io/en/latest/topics/resources.html
               options.EmitStaticAudienceClaim = true;

            })
                .AddConfigurationStore(options =>
                {
                    options.ConfigureDbContext = builder =>
                    {
                        //builder.UseSqlite(connectionString);
                        builder.UseSqlServer(connectionString, sql => sql.MigrationsAssembly(migrationsAssembly));
                    };
                    options.DefaultSchema = ApplicationDbContext.DB_SCHEMA;
                })
                // this adds the operational data from DB (codes, tokens, consents)
                .AddOperationalStore(options =>
                {
                    options.ConfigureDbContext = builder =>
                    {
                        //builder.UseSqlite(connectionString);
                        builder.UseSqlServer(connectionString, sql => sql.MigrationsAssembly(migrationsAssembly));
                    };

                    options.DefaultSchema = ApplicationDbContext.DB_SCHEMA;

                    // this enables automatic token cleanup. this is optional.
                    options.EnableTokenCleanup = true;
                })
                .AddAspNetIdentity<ApplicationUser>(); ;

            services.AddTransient<IProfileService, ProfileService>();
            services.AddScoped<IEventSink, IdentityEventSink>();

            var CorsHosts = Configuration.GetSection("CorsHosts").Get<string>();
            services.AddCors(options =>
            {
                options.AddPolicy(name: AllowSpecificOrigins,
                    policy =>
                    {
                        policy.AllowAnyHeader()
                            .WithOrigins(CorsHosts.Split(";"))// * now allow in SignalR
                            .SetIsOriginAllowedToAllowWildcardSubdomains()
                            .AllowAnyMethod()
                            .AllowCredentials();
                    });
            });

            services.Configure<CookieAuthenticationOptions>(
                IdentityServerConstants.DefaultCookieAuthenticationScheme,
                options =>
            {
                options.Cookie.SameSite = SameSiteMode.None;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.Cookie.IsEssential = true;
            });

            //TODO: AddDeveloperSigningCredential not recommended for production - you need to store your key material somewhere secure
            if (Environment.IsDevelopment())
            {
                builder.AddDeveloperSigningCredential();
            }
            else
            {
                var rsa = new RsaKeyService(Environment, TimeSpan.FromDays(30));
                services.AddSingleton<RsaKeyService>(provider => rsa);

                builder.AddSigningCredential(rsa.GetKey());
            }

            var authBuilder = services.AddAuthentication();


            services.Configure<IdentityOptions>(Configuration.GetSection(nameof(IdentityOptions)));

            //Grpc Service
            AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);
            services.AddGrpc(options =>
            {
                options.EnableDetailedErrors = true;
            });


            services.AddHttpClient();
            services.AddHttpContextAccessor();
            services.AddScoped<IUserContext, HttpUserContext>();
        }

        public void Configure(IApplicationBuilder app)
        {
            if (Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }

            //forward header from nginx proxy to .well-known urls is same domain
            var fordwardedHeaderOptions = new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost
            };
            fordwardedHeaderOptions.KnownNetworks.Clear();
            fordwardedHeaderOptions.KnownProxies.Clear();
            app.UseForwardedHeaders(fordwardedHeaderOptions);

            app.UseStaticFiles();
            app.UseCors(AllowSpecificOrigins);
            //Khong can
            app.UseCookiePolicy(new CookiePolicyOptions
            {
                HttpOnly = HttpOnlyPolicy.None,
                MinimumSameSitePolicy = SameSiteMode.None,
                Secure = CookieSecurePolicy.Always
            });


            app.UseRouting();
            app.UseIdentityServer();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGrpcService<GrpcIdentityService>();
                endpoints.MapDefaultControllerRoute();
            });
        }

        private void AddExternalAuthenticationProvider(AuthenticationBuilder authenticationBuilder)
        {
            authenticationBuilder.AddGoogle(options =>
             {
                 options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;

                 // register your IdentityServer with Google at https://console.developers.google.com
                 // enable the Google+ API
                 // set the redirect URI to https://localhost:5001/signin-google
                 options.ClientId = "copy client ID from Google here";
                 options.ClientSecret = "copy client secret from Google here";
             });
        }
    }
}
