using FluentValidation;
using MasterService.DTOs.User;

namespace MasterService.Validators
{
    public class CreateUserValidator : AbstractValidator<CreateUserDTO>
    {
        public CreateUserValidator()
        {
            RuleFor(r => r.Name).NotEmpty().MinimumLength(4);
            RuleFor(r => r.Email).NotEmpty().EmailAddress();
            RuleFor(r => r.Phone).Matches(@"^(\+84|0[1-9])[0-9]{1,12}$").WithMessage("Not Format Phone Number");
        }
    }

    public class UpdateUserValidator: AbstractValidator<UpdateUserDTO>
    {
        public UpdateUserValidator()
        {
            RuleFor(r => r.Name).NotEmpty().MinimumLength(4);
            RuleFor(r => r.Phone).Matches(@"^(\+84|0[1-9])[0-9]{1,12}$").WithMessage("Not Format Phone Number");
        }
    }

    public class UserProfileValidator : AbstractValidator<UpdateMyProfileDTO>
    {
        public UserProfileValidator()
        {
            RuleFor(r => r.Name).NotEmpty().MinimumLength(4);
            RuleFor(r => r.Phone).Matches(@"^(\+84|0[1-9])[0-9]{1,12}$").WithMessage("Not Format Phone Number");
        }
    }
}
