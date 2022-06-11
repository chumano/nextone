// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using IdentityServer4.EntityFramework.DbContexts;
using IdentityService.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Logging;
using NextOne.Infrastructure.Core.Logging;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.SystemConsole.Themes;
using System;
using System.Linq;
using System.Net;

namespace IdentityService
{
    public class Program
    {
        public static int Main(string[] args)
        {
            try
            {
                //var seed = args.Contains("/seed");
                //if (seed)
                //{
                //    Console.WriteLine("Seeding...");
                //    args = args.Except(new[] { "/seed" }).ToArray();
                //}

                var host = CreateHostBuilder(args).Build();

                DbMigrations(host);
                Console.WriteLine($"Starting host ...");
                host.Run();
                return 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Host terminated unexpectedly: " + ex.Message);
                return 1;
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((context, config) =>
                {
                    Console.WriteLine($"EnvironmentName: {context.HostingEnvironment.EnvironmentName}");
                    config.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                        .AddJsonFile($"appsettings.{context.HostingEnvironment.EnvironmentName}.json", true, true);

                    if (context.HostingEnvironment.IsDevelopment())
                    {
                        //https://docs.microsoft.com/en-us/aspnet/core/security/app-secrets?view=aspnetcore-3.1&tabs=windows
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
                        var inDocker = ctx.Configuration.GetSection("DOTNET_RUNNING_IN_CONTAINER").Get<bool>();
                        var useHttps = ctx.Configuration.GetSection("UseHttps").Get<bool>();
                        if (ctx.HostingEnvironment.IsDevelopment())
                        {
                            IdentityModelEventSource.ShowPII = true;
                        }

                        options.Limits.MinRequestBodyDataRate = null;
                        //indocker don't use https, if want then follow the following link
                        //https://codeburst.io/hosting-an-asp-net-core-app-on-docker-with-https-642cde4f04e8
                        //https://docs.microsoft.com/en-us/aspnet/core/grpc/aspnetcore?view=aspnetcore-6.0&tabs=visual-studio
                        //if (!inDocker)
                        {
                            options.Listen(IPAddress.Any, 5102, listenOptions =>
                            {
                                if (!inDocker && useHttps)
                                {
                                    listenOptions.UseHttps();
                                }
                            });
                        }

                        //options.Listen(IPAddress.Loopback, 5102, listenOptions =>
                        //{
                        //});
                        options.Listen(IPAddress.Any, 15102, listenOptions =>
                        {
                            listenOptions.Protocols = HttpProtocols.Http2;
                        });
                    });

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
                    var appDbContext = services.GetRequiredService<ApplicationDbContext>();
                    appDbContext.Database.Migrate();

                    var configDbContext = services.GetRequiredService<ConfigurationDbContext>();
                    configDbContext.Database.Migrate();

                    var persistedGrantDbContext = services.GetRequiredService<PersistedGrantDbContext>();
                    persistedGrantDbContext.Database.Migrate();
                }

                var seed = services.GetRequiredService<IConfiguration>().GetValue<bool>("IsDBSeed");
                if (seed)
                {
                    Console.WriteLine("Seeding database...");
                    var config = host.Services.GetRequiredService<IConfiguration>();
                    var connectionString = config.GetConnectionString("DefaultConnection");
                    SeedData.EnsureSeedData(connectionString);
                    Console.WriteLine("Done seeding database.");
                }
            }

        }

    }
}