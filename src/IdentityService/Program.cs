// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
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
                var seed = args.Contains("/seed");
                if (seed)
                {
                    Console.WriteLine("Seeding...");
                    args = args.Except(new[] { "/seed" }).ToArray();
                }

                var host = CreateHostBuilder(args).Build();

                if (seed)
                {
                    Console.WriteLine("Seeding database...");
                    var config = host.Services.GetRequiredService<IConfiguration>();
                    var connectionString = config.GetConnectionString("DefaultConnection");
                    SeedData.EnsureSeedData(connectionString);
                    Console.WriteLine("Done seeding database.");
                    return 0;
                }

                Console.WriteLine("Starting host...");
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
                        if (ctx.HostingEnvironment.IsDevelopment())
                        {
                            IdentityModelEventSource.ShowPII = true;
                        }

                        options.Limits.MinRequestBodyDataRate = null;
                        options.Listen(IPAddress.Any, 5102, listenOptions=>
                        {
                            listenOptions.UseHttps();
                        });
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
    }
}