
using System;
using System.Collections.Generic;
using System.Text;
using Serilog;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace NextOne.Infrastructure.Core.Logging
{
    public static class LoggingExtensions
    {
        public static IHostBuilder UseLogging(this IHostBuilder hostBuilder, string applicationName = "")
        {
            hostBuilder.UseSerilog((context, loggerConfiguration) =>
            {
                var loggingOptions = context.Configuration.GetSection("Logging").Get<LoggingOptions>() ;

                loggerConfiguration
                    .ReadFrom.Configuration(context.Configuration, "Serilog")
                    .Enrich.FromLogContext()
                    .Enrich.WithProperty("Environment", context.HostingEnvironment.EnvironmentName)
                    .Enrich.WithProperty("AppName", applicationName);

            });

            return hostBuilder;
        }
    }
}
