using MasterService.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Logging;
using NextOne.Infrastructure.Core.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace MasterService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            DbMigrations(host);
            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((context, config) =>
                {
                    config.AddJsonFile("appsettings.json", optional: true)
                     .AddJsonFile($"appsettings.{context.HostingEnvironment.EnvironmentName}.json", true, true);
                   
                    if (context.HostingEnvironment.IsDevelopment())
                    {
                        //config.AddUserSecrets<Program>();
                    }
                    config.AddEnvironmentVariables();
                    config.AddCommandLine(args);
                })
                .UseLogging()
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.ConfigureKestrel((ctx, options) =>
                    {
                        if (ctx.HostingEnvironment.IsDevelopment())
                        {
                            IdentityModelEventSource.ShowPII = true;
                        }

                        options.Limits.MinRequestBodyDataRate = null;
                        options.Listen(IPAddress.Any, 5103, listenOptions =>
                        {

                        });
                        //options.Listen(IPAddress.Loopback, 5103);
                        options.Listen(IPAddress.Any, 15103, listenOptions =>
                        {
                            listenOptions.Protocols = HttpProtocols.Http2;
                        });
                    });

                    webBuilder.UseStartup<Startup>()
                        .UseKestrel(o =>
                        {
                            o.AllowSynchronousIO = true;
                        }); ;
                });

        public static void DbMigrations(IHost host)
        {
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var isAutoMigration = services.GetRequiredService<IConfiguration>().GetValue<bool>("IsAutoMigration");

                if (isAutoMigration)
                {
                    var appDbContext = services.GetRequiredService<MasterDBContext>();
                    appDbContext.Database.Migrate();
                }
            }

        }
    }
}
