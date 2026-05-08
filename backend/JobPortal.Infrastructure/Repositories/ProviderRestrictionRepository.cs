using JobPortal.Application.Interfaces;
using JobPortal.Domain.Entities;
using JobPortal.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.Infrastructure.Repositories
{
    public class ProviderRestrictionRepository : IProviderRestrictionRepository
    {
        private readonly JobPortalDbContext _context;
        public ProviderRestrictionRepository(JobPortalDbContext context)
        {
            _context = context;
        }

        public async Task<ProviderRestriction?> GetByProviderAndSeekerAsync(int providerId, int seekerId)
        {
            return await _context.Set<ProviderRestriction>()
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.ProviderId == providerId && r.SeekerId == seekerId);
        }

        public async Task<bool> ExistsAsync(int providerId, int seekerId)
        {
            return await _context.Set<ProviderRestriction>()
                .AsNoTracking()
                .AnyAsync(r => r.ProviderId == providerId && r.SeekerId == seekerId);
        }

        public async Task<ProviderRestriction> CreateAsync(ProviderRestriction restriction)
        {
            _context.Set<ProviderRestriction>().Add(restriction);
            await _context.SaveChangesAsync();
            return restriction;
        }

        public async Task<IEnumerable<int>> GetRestrictedProviderIdsForSeekerAsync(int seekerId)
        {
            return await _context.Set<ProviderRestriction>()
                .AsNoTracking()
                .Where(r => r.SeekerId == seekerId)
                .Select(r => r.ProviderId)
                .ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}