using MapService.Infrastructure;
using Microsoft.AspNetCore.Hosting;
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
using System.Threading.Tasks;

namespace MapService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Map 1.0.0 run....");
            var host = CreateHostBuilder(args).Build();
            DbMigrations(host);
            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((context, config) =>
                {
                    IdentityModelEventSource.ShowPII = true;

                    config.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
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
                    webBuilder.UseStartup<Startup>();
                });


        public static void DbMigrations(IHost host)
        {
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var isAutoMigration = services.GetRequiredService<IConfiguration>().GetValue<bool>("IsAutoMigration");

                if (isAutoMigration)
                {
                    var appDbContext = services.GetRequiredService<MapDBContext>();
                    appDbContext.Database.Migrate();
                }
            }

        }
    }
}
