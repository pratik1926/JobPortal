using FluentValidation;
using JobPortal.Application.DTOs;

public class CreateJobBulkDtoValidator : AbstractValidator<CreateJobBulkDto>
{
    public CreateJobBulkDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required");

        RuleFor(x => x.Budget)
            .GreaterThan(0).WithMessage("Budget must be greater than 0");
    }
}