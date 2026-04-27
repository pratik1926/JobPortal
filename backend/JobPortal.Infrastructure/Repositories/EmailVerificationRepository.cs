using Microsoft.EntityFrameworkCore;
using JobPortal.Application.Interfaces;
using JobPortal.Domain.Entities;
using JobPortal.Infrastructure.Persistence;

namespace JobPortal.Infrastructure.Repositories
{
    public class EmailVerificationRepository : IEmailVerificationRepository
    {
        private readonly JobPortalDbContext _context;

        public EmailVerificationRepository(JobPortalDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(EmailVerification entity)
        {
            await _context.EmailVerifications.AddAsync(entity);
        }

        public async Task<EmailVerification?> GetLatestByEmailAsync(string email)
        {
            return await _context.EmailVerifications
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync(x => x.Email == email);
        }

        public async Task RemoveByEmailAsync(string email)
        {
            var existing = _context.EmailVerifications
                .Where(x => x.Email == email);

            _context.EmailVerifications.RemoveRange(existing);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}