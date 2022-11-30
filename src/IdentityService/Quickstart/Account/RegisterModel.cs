using System.ComponentModel.DataAnnotations;

namespace IdentityServerHost.Quickstart.UI
{
    public class RegisterModel
    {
        //[Required]
        //[MinLength(4)]
        //[MaxLength(50)]
        //public string UserName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }


        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }

    }
}
