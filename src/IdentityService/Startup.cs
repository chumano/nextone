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

namespace IdentityService
{
    public class Startup
    {
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

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins",
                    builder =>
                    {
                        builder
                            .WithOrigins("http://localhost:5100", "https://localhost:5100")
                            .SetIsOriginAllowedToAllowWildcardSubdomains()
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
            });


            //TODO: AddDeveloperSigningCredential not recommended for production - you need to store your key material somewhere secure
            builder.AddDeveloperSigningCredential();

            var authBuilder = services.AddAuthentication();

            services.AddScoped<IUserContext, HttpUserContext>();
        }

        public void Configure(IApplicationBuilder app)
        {
            if (Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }

            app.UseStaticFiles();
            app.UseCors("AllowAllOrigins");
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
