using FileService.Infrastructure;
using FileService.Infrastructure.AppSettings;
using FileService.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;
using NextOne.Infrastructure.Core.Identity;
using NextOne.Shared.Common;
using SharedDomain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace FileService
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
                    //options.SerializerSettings.ContractResolver = new DefaultContractResolver()
                    //{
                    //    NamingStrategy = null
                    //};
                    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                    options.SerializerSettings.DateFormatString = Constants.DateTimeFormat;
                });

            var migrationsAssembly = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;
            var connectionString = Configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<FileDbContext>(options =>
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
                jwtOptions.Authority = identityServerOptions.Authority;
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

            services.AddHttpContextAccessor();
            services.AddHttpClient();

            services.Configure<LocalFileSettings>(Configuration.GetSection("LocalFileSettings"));

            services.AddSingleton<IdGenerator, DefaultIdGenerator>();
            services.AddSingleton<IFileStorage, LocalFileStorage>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseCors(AllowSpecificOrigins);
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
