using ComService.Boudaries.Hubs;
using ComService.Domain.Repositories;
using ComService.Domain.Services;
using ComService.Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using NextOne.Infrastructure.Core.Identity;
using NextOne.Infrastructure.MessageBus.Bus;
using NextOne.Infrastructure.MessageBus.Notification;
using NextOne.Shared.Bus;
using NextOne.Shared.Common;
using NextOne.Shared.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace ComService
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);
            //Grpc Clients
            services.AddGrpcClient<NextOne.Protobuf.Master.GrpcMasterService.GrpcMasterServiceClient>(o =>
            {
                //TODO: setting grpc url in for masterservice
                var grpcUrl = "http://localhost:15103";
                o.Address = new Uri(grpcUrl);
            });

            var migrationsAssembly = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;
            var connectionString = Configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<ComDbContext>(options =>
            {
                options.UseSqlServer(connectionString, sql => sql.MigrationsAssembly(migrationsAssembly));
                options.EnableDetailedErrors(true);
                options.EnableSensitiveDataLogging(true);

            });


            var identityServerOptions = Configuration.GetSection(nameof(IdentityServerOptions)).Get<IdentityServerOptions>();
            services.AddAuthentication(options =>
            {
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer("Bearer", jwtOptions =>
            {
                jwtOptions.Authority = identityServerOptions.Authority;// "https://localhost:5102";
                jwtOptions.Audience = "gateway"; // ApiResources
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
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/hub")))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });

            services.AddSignalR(options =>
            {
                options.EnableDetailedErrors = true;
            }).AddNewtonsoftJsonProtocol();

            services.AddMediatR(typeof(Startup).Assembly);

            services.AddHttpContextAccessor();
            services.AddHttpClient();
            services.AddSingleton<IdGenerator, DefaultIdGenerator>();
            services.AddScoped<IUserContext, HttpUserContext>();
            services.AddSingleton<IBus, LocalMediatRBus>();
            services.AddSingleton<INotificationService, NotificationService>();

            services.AddScoped<IConversationRepository, ConversationRepository>();
            services.AddScoped<IChannelRepository, ChannelRepository>();
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddScoped<IEventRepository, EventRepository>();
            services.AddScoped<IUserStatusRepository, UserStatusRepository>();

            services.AddScoped<IConversationService, ConversationService>();
            services.AddScoped<IChannelService, ChannelService>();
            services.AddScoped<IUserStatusService, UserStatusService>();
            services.AddScoped<IMasterService, MasterService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpointBuilder =>
            {
                endpointBuilder.MapHub<ChatHub>("/hubChat");
                endpointBuilder.MapHub<NotificationHub>("/hubNotification");
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
