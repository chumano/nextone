using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;
using IdentityService.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static IdentityServer4.IdentityServerConstants;

namespace IdentityService.Services
{
    public class ProfileService : IProfileService
    {
        /// <summary>
        /// The claims factory.
        /// </summary>
        protected readonly IUserClaimsPrincipalFactory<ApplicationUser> ClaimsFactory;

        /// <summary>
        /// The logger
        /// </summary>
        protected readonly ILogger<ProfileService> Logger;

        /// <summary>
        /// The user manager.
        /// </summary>
        protected readonly UserManager<ApplicationUser> UserManager;

        /// <summary>
        /// Initializes a new instance of the <see cref="ProfileService{TUser}"/> class.
        /// </summary>
        /// <param name="userManager">The user manager.</param>
        /// <param name="claimsFactory">The claims factory.</param>
        public ProfileService(UserManager<ApplicationUser> userManager,
            IUserClaimsPrincipalFactory<ApplicationUser> claimsFactory)
        {
            UserManager = userManager;
            ClaimsFactory = claimsFactory;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ProfileService{TUser}"/> class.
        /// </summary>
        /// <param name="userManager">The user manager.</param>
        /// <param name="claimsFactory">The claims factory.</param>
        /// <param name="logger">The logger.</param>
        public ProfileService(UserManager<ApplicationUser> userManager,
            IUserClaimsPrincipalFactory<ApplicationUser> claimsFactory,
            ILogger<ProfileService> logger)
        {
            UserManager = userManager;
            ClaimsFactory = claimsFactory;
            Logger = logger;
        }

        /// <summary>
        /// This method is called whenever claims about the user are requested (e.g. during token creation or via the userinfo endpoint)
        /// </summary>
        /// <param name="context">The context.</param>
        /// <returns></returns>
        public  async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var sub = context.Subject?.GetSubjectId();
            if (sub == null) throw new Exception("No sub claim present");

            var user = await UserManager.FindByIdAsync(sub);
            if (user == null)
            {
                Logger?.LogWarning("No user found matching subject Id: {0}", sub);
            }
            else
            {
                var principal = await ClaimsFactory.CreateAsync(user);
                if (principal == null) throw new Exception("ClaimsFactory failed to create a principal");
               
                context.AddRequestedClaims(principal.Claims);

                //TODO: add more claims if need
                if (context.Caller == ProfileDataCallers.ClaimsProviderIdentityToken) //id_token
                {

                }
                else if (context.Caller == ProfileDataCallers.ClaimsProviderAccessToken) //access_token
                {

                }
                else if (context.Caller == ProfileDataCallers.UserInfoEndpoint) //user_info
                {

                }

                string system = user.ApplicationSystem;
                if (string.IsNullOrEmpty(system)) system = "NextOne";
                context.IssuedClaims.Add(new System.Security.Claims.Claim("ApplicationSystem", system));
            }
        }

        /// <summary>
        /// This method gets called whenever identity server needs to determine if the user is valid or active (e.g. if the user's account has been deactivated since they logged in).
        /// (e.g. during token issuance or validation).
        /// </summary>
        /// <param name="context">The context.</param>
        /// <returns></returns>
        public  async Task IsActiveAsync(IsActiveContext context)
        {

            var sub = context.Subject?.GetSubjectId();
            if (sub == null) throw new Exception("No subject Id claim present");

            var user = await UserManager.FindByIdAsync(sub);
            if (user == null)
            {
                Logger?.LogWarning("No user found matching subject Id: {0}", sub);
            }
            //ProfileIsActiveCallers

            context.IsActive = user != null;
        }
    }
}
