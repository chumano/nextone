using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using NextOne.Shared.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace UserDomain
{
    public static class ServicesCollectionExtensions
    {
        public static IServiceCollection AddUserDomain(this IServiceCollection services,
            string connectionString,
            string migrationAssamblyName = null)
        {
            services.AddDbContext<UserDBContext>(options =>
            {
                options.UseSqlServer(connectionString, o =>
                {
                    o.EnableRetryOnFailure(maxRetryCount: 3);
                    if (!string.IsNullOrEmpty(migrationAssamblyName))
                    {
                        o.MigrationsAssembly(migrationAssamblyName);
                    }
                });
                options.EnableDetailedErrors(true);
                options.EnableSensitiveDataLogging(false);
            });


            services.TryAddSingleton<IdGenerator, DefaultIdGenerator>();
            services.AddScoped<UserActivityService>();
            return services;
        }
    }
}
