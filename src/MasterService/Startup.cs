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

namespace MasterService
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

            //=======================

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
