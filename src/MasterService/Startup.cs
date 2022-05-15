using MasterService.Boudaries.Grpc;
using MasterService.Infrastructure;
using MasterService.Infrastructure.Grpc;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Grpc.Net.ClientFactory;
using MediatR;
using NextOne.Shared.Common;
using NextOne.Shared.Security;
using NextOne.Shared.Bus;
using MasterService.Domain.Repositories;
using MasterService.Domain.Services;
using NextOne.Infrastructure.MessageBus.Bus;
using Microsoft.IdentityModel.Tokens;
using NextOne.Infrastructure.Core.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using SharedDomain;

namespace MasterService
{
    public class Startup
    {
        private string AllowSpecificOrigins = "AllowSpecificOrigins";
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers()
                .AddNewtonsoftJson((options) =>
                {
                    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                    options.SerializerSettings.DateFormatString = Constants.DateTimeFormat;
                });

            //DBContext
            var connString = Configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<MasterDBContext>(options =>
            {
                options.UseSqlServer(connString, o =>
                {
                    o.EnableRetryOnFailure(maxRetryCount: 3);
                });
                options.EnableDetailedErrors(true);
                options.EnableSensitiveDataLogging(false);
            });
            services.AddScoped<DbContext>(provider => provider.GetService<MasterDBContext>());


            //Grpc Service
            AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);
            services.AddGrpc(options =>
            {
                options.Interceptors.Add<GrpcExceptionInterceptor>();
                options.EnableDetailedErrors = true;
            });

            //Grpc Clients
            services.AddGrpcClient<NextOne.Protobuf.Identity.GrpcIdentityService.GrpcIdentityServiceClient>(o =>
            {
                //TODO: setting grpc url in for identityservice
                var grpcUrl = "http://localhost:15102";
                o.Address = new Uri(grpcUrl);
            });

            var identityServerOptions = Configuration.GetSection(nameof(IdentityServerOptions)).Get<IdentityServerOptions>();
            services.AddAuthentication(options =>
            {
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer("Bearer", jwtOptions =>
            {
                jwtOptions.Authority = identityServerOptions.Authority;
                jwtOptions.Audience = "master"; // ApiResources
                jwtOptions.RequireHttpsMetadata = identityServerOptions.RequireHttpsMetadata;
                jwtOptions.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                };
                jwtOptions.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        return Task.CompletedTask;
                    }
                };
            });

            var CorsHosts = Configuration.GetSection("CorsHosts").Get<string>();
            services.AddCors(options =>
            {
                options.AddPolicy(name: AllowSpecificOrigins,
                    policy =>
                    {
                        policy.AllowAnyHeader()
                            .AllowAnyMethod()
                            .WithOrigins(CorsHosts.Split(";"))// * now allow in SignalR
                            .AllowCredentials();
                    });
            });

            services.AddMediatR(typeof(Startup).Assembly);

            services.AddHttpContextAccessor();
            services.AddHttpClient();
            services.AddSingleton<IdGenerator, DefaultIdGenerator>();
            services.AddScoped<IUserContext, HttpUserContext>();
            services.AddSingleton<IBus, LocalMediatRBus>();

            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IRoleRepository, RoleRepository>();
            services.AddScoped<IUserActivityRepository, UserActivityRepository>();

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IIdentityService, IdentityService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors(AllowSpecificOrigins);
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();

                endpoints.MapGrpcService<GrpcMasterService>();

                endpoints.MapGet("/", async context =>
                {
                    await context.Response.WriteAsync("Communication with gRPC endpoints must be made through a gRPC client");
                });
            });
        }
    }
}
