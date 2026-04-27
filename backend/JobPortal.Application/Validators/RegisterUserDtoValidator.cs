using FluentValidation;
using JobPortal.Application.DTOs;

namespace JobPortal.Application.Validators
{
    public class RegisterUserDtoValidator : AbstractValidator<RegisterUserDto>
    {
        public RegisterUserDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Name is required")
                .MinimumLength(3).WithMessage("Name must be at least 3 characters");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email format");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters")
                .Matches("[A-Z]").WithMessage("Must contain at least one uppercase letter")
                .Matches("[a-z]").WithMessage("Must contain at least one lowercase letter")
                .Matches("[0-9]").WithMessage("Must contain at least one number")
                .Matches("[^a-zA-Z0-9]").WithMessage("Must contain at least one special character");

            RuleFor(x => x.Role)
                .NotEmpty().WithMessage("Role is required")
                .Must(role => role == "Seeker" || role == "Provider")
                .WithMessage("Invalid role");
        }
    }
}