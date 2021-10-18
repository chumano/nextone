using Gateway.Middlewares;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Logging;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Ocelot.Provider.Consul;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gateway
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;

            Log.Logger = new LoggerConfiguration()
            .ReadFrom.Configuration(configuration)
            .CreateLogger();

            Log.Logger.Information("Hello, world!");
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            

            services.AddOcelot()
                    .AddConsul();
            services.AddControllers();

            var authenticationProviderKey = "Bearer";
            Action<JwtBearerOptions> options = o =>
            {
                o.Authority = "https://localhost:5102";
                o.Audience = "gateway"; // ApiResources
                // etc
            };

            services.AddAuthentication()//IdentityServerAuthenticationDefaults.AuthenticationScheme
                .AddJwtBearer(authenticationProviderKey, options);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                IdentityModelEventSource.ShowPII = true; // apply for debug Identity error. I will show personally identifiable information
                app.UseDeveloperExceptionPage();
            }


            app.UseHttpsRedirection();

            app.UseRouting();
           
            app.UseAuthorization();

            app.UseMiddleware<RequestLogContextMiddleware>();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseWebSockets();
            app.UseOcelot(new OcelotPipelineConfiguration
            {
                /*
                    PreErrorResponderMiddleware -  exceptions or strange behavior .
                    PreAuthenticationMiddleware - This allows the user to run pre authentication logic and then call Ocelot’s authentication middleware.
                    AuthenticationMiddleware - This overrides Ocelots authentication middleware.
                    PreAuthorizationMiddleware - This allows the user to run pre authorization logic and then call Ocelot’s authorization middleware.
                    AuthorizationMiddleware - This overrides Ocelots authorization middleware.
                    PreQueryStringBuilderMiddleware - This allows the user to manipulate the query string on the http request before it is passed to Ocelots request creator.
                */
                PreErrorResponderMiddleware = async (ctx, next) =>
                {
                    await next.Invoke();
                }
            }).Wait();


        }
    }
}
