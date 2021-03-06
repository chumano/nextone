using ComService.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NextOne.Infrastructure.Core.Logging;
using Serilog;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ComService
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
                .UseContentRoot(Directory.GetCurrentDirectory())
                .ConfigureAppConfiguration((context, config) =>
                {
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
                    var appDbContext = services.GetRequiredService<ComDbContext>();
                    appDbContext.Database.Migrate();

                    if (!appDbContext.Settings.Any())
                    {
                        Log.Debug("Settings being populated");
                        foreach (var settings in SeedData.Settings)
                        {
                            appDbContext.Settings.Add(settings);
                        }
                        appDbContext.SaveChanges();
                    }
                    else
                    {
                        Log.Debug("Settings already populated");
                    }
                }
            }

        }
    }
}
