using FluentValidation;
using JobPortal.Application.DTOs;

namespace JobPortal.Application.Validators
{
    public class ChangePasswordDtoValidator : AbstractValidator<ChangePasswordDto>
    {
        public ChangePasswordDtoValidator()
        {
            RuleFor(x => x.CurrentPassword)
                .NotEmpty().WithMessage("Current password is required");

            RuleFor(x => x.NewPassword)
                .NotEmpty().WithMessage("New password is required")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters")
                .Matches("[A-Z]").WithMessage("Password must contain at least 1 uppercase letter")
                .Matches("[0-9]").WithMessage("Password must contain at least 1 number")
                .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain at least 1 special character");
        }
    }
}