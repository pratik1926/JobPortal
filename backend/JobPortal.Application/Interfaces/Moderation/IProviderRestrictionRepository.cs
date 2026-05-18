using JobPortal.Domain.Entities;

namespace JobPortal.Application.Interfaces.Moderation
{
    public interface IProviderRestrictionRepository
    {
        Task<ProviderRestriction?> GetByProviderAndSeekerAsync(int providerId, int seekerId);
        Task<bool> ExistsAsync(int providerId, int seekerId);
        Task<ProviderRestriction> CreateAsync(ProviderRestriction restriction);
        Task<IEnumerable<int>> GetRestrictedProviderIdsForSeekerAsync(int seekerId);
        Task SaveChangesAsync();
    }
}