using JobPortal.Domain.Entities;

namespace JobPortal.Application.Interfaces
{
    public interface IEmailVerificationRepository
    {
        Task AddAsync(EmailVerification entity);
        Task<EmailVerification?> GetLatestByEmailAsync(string email);
        Task RemoveByEmailAsync(string email);
        Task SaveChangesAsync();
        Task<EmailVerification?> GetLatestVerifiedAsync(string email);
        Task<bool> IsVerifiedAsync(string email);
        Task MarkAsUsedAsync(EmailVerification record);
    }
}