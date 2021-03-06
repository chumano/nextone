using FileService.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host =CreateHostBuilder(args).Build();
            DbMigrations(host);
            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
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
                    var appDbContext = services.GetRequiredService<FileDbContext>();
                    appDbContext.Database.Migrate();
                }
            }

        }
    }
}
