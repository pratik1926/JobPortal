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
                .Where(x => x.Email == email)
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync();
        }

        // ✅ NEW: get latest verified record
        public async Task<EmailVerification?> GetLatestVerifiedAsync(string email)
        {
            return await _context.EmailVerifications
                .Where(x => x.Email == email && x.IsVerified)
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync();
        }

        // ✅ NEW: quick check
        public async Task<bool> IsVerifiedAsync(string email)
        {
            return await _context.EmailVerifications
                .AnyAsync(x => x.Email == email && x.IsVerified);
        }

        public async Task RemoveByEmailAsync(string email)
        {
            var existing = _context.EmailVerifications
                .Where(x => x.Email == email);

            _context.EmailVerifications.RemoveRange(existing);
            await _context.SaveChangesAsync();
        }

        // ✅ NEW: consume verification after registration
        public async Task MarkAsUsedAsync(EmailVerification record)
        {
            _context.EmailVerifications.Remove(record); // simple approach
            await _context.SaveChangesAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}