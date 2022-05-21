// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Mappers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using IdentityServer4.EntityFramework.Storage;
using Serilog;
using System.Reflection;
using IdentityService.Data;
using Microsoft.AspNetCore.Identity;
using IdentityService.Models;

namespace IdentityService
{
    public class SeedData
    {
        //dotnet run /seed
        public static void EnsureSeedData(string connectionString)
        {
            var migrationsAssembly = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;
            var services = new ServiceCollection();

            services.AddLogging();
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(connectionString, sql => sql.MigrationsAssembly(migrationsAssembly));

            });

            services.AddIdentity<ApplicationUser, ApplicationRole>(opts =>
                {
                    opts.Password.RequireDigit = true;
                    opts.Password.RequireLowercase = true;
                    opts.Password.RequireUppercase = true;
                    opts.Password.RequireNonAlphanumeric = false;
                    opts.Password.RequiredUniqueChars = 1;
                    opts.Password.RequiredLength = 6;
                })
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddSignInManager();

            services.AddOperationalDbContext(options =>
            {
                options.ConfigureDbContext = db =>
                    //db.UseSqlite(connectionString, sql => sql.MigrationsAssembly(typeof(SeedData).Assembly.FullName)
                    db.UseSqlServer(connectionString, sql => sql.MigrationsAssembly(migrationsAssembly));

                options.DefaultSchema = ApplicationDbContext.DB_SCHEMA;
            });
            services.AddConfigurationDbContext(options =>
            {
                options.ConfigureDbContext = db =>
                    //db => db.UseSqlite(connectionString, sql => sql.MigrationsAssembly(typeof(SeedData).Assembly.FullName));
                    db.UseSqlServer(connectionString, sql => sql.MigrationsAssembly(migrationsAssembly));

                options.DefaultSchema = ApplicationDbContext.DB_SCHEMA;
            });

            var serviceProvider = services.BuildServiceProvider();

            using (var scope = serviceProvider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var identityContext = scope.ServiceProvider.GetService<ApplicationDbContext>();
                identityContext.Database.Migrate();

                var userManager = scope.ServiceProvider.GetService<UserManager<ApplicationUser>>();
                EnsureSeedUserData(identityContext, userManager);

                var configurationContext = scope.ServiceProvider.GetService<ConfigurationDbContext>();
                configurationContext.Database.Migrate();
                EnsureSeedClientData(configurationContext);

                scope.ServiceProvider.GetService<PersistedGrantDbContext>().Database.Migrate();
            }
        }

        private static void EnsureSeedUserData(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            //Roles
            if (!context.Roles.Any())
            {
                Log.Debug("Roles being populated");
                foreach (var role in Config.Roles)
                {
                    context.Roles.Add(role);
                }
                context.SaveChanges();
            }
            else
            {
                Log.Debug("Roles already populated");
            }

            //Users
            if (!context.Users.Any())
            {
                Log.Debug("Users being populated");
                foreach (var user in Config.Users)
                {
                    IdentityResult result = userManager.CreateAsync(user, "Nextone@123").Result;

                    if (result.Succeeded)
                    {
                        var role = user.UserName.ToLower();
                        userManager.AddToRoleAsync(user, role).Wait();
                    }
                }
                context.SaveChanges();
            }
            else
            {
                Log.Debug("Users already populated");
            }

            //Systems
            if (!context.Systems.Any())
            {
                Log.Debug("Systems being populated");
                foreach (var system in Config.Systems)
                {
                    context.Systems.Add(system);
                }
                context.SaveChanges();
            }
            else
            {
                Log.Debug("Systems already populated");
            }
        }

        private static void EnsureSeedClientData(ConfigurationDbContext context)
        {
            if (!context.Clients.Any())
            {
                Log.Debug("Clients being populated");
                foreach (var client in Config.Clients.ToList())
                {
                    context.Clients.Add(client.ToEntity());
                }
                context.SaveChanges();
            }
            else
            {
                Log.Debug("Clients already populated");
            }

            if (!context.IdentityResources.Any())
            {
                Log.Debug("IdentityResources being populated");
                foreach (var resource in Config.IdentityResources.ToList())
                {
                    context.IdentityResources.Add(resource.ToEntity());
                }
                context.SaveChanges();
            }
            else
            {
                Log.Debug("IdentityResources already populated");
            }

            if (!context.ApiScopes.Any())
            {
                Log.Debug("ApiScopes being populated");
                foreach (var resource in Config.ApiScopes.ToList())
                {
                    context.ApiScopes.Add(resource.ToEntity());
                }
                context.SaveChanges();
            }
            else
            {
                Log.Debug("ApiScopes already populated");
            }


            if (!context.ApiResources.Any())
            {
                Log.Debug("ApiResources being populated");
                foreach (var resource in Config.ApiResources.ToList())
                {
                    context.ApiResources.Add(resource.ToEntity());
                }
                context.SaveChanges();
            }
            else
            {
                Log.Debug("ApiResources already populated");
            }
        }
    }
}
