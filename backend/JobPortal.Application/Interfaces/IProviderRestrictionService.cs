using JobPortal.Application.DTOs.Moderation;

namespace JobPortal.Application.Interfaces
{
    public interface IProviderRestrictionService
    {
        /// <summary>
        /// Create a provider-level restriction (idempotent). Returns created DTO or existing DTO if it already existed.
        /// Transactional and logs moderation action.
        /// </summary>
        Task<ProviderRestrictionDto> CreateRestrictionAsync(CreateProviderRestrictionDto dto, int adminId);

        /// <summary>
        /// Create a restriction from a report (admin action). Returns DTO.
        /// </summary>
        Task<ProviderRestrictionDto> CreateFromReportAsync(int reportId, int adminId);

        /// <summary>
        /// Returns true if seeker is restricted by provider.
        /// </summary>
        Task<bool> IsSeekerRestrictedForProviderAsync(int seekerId, int providerId);

        /// <summary>
        /// Returns provider ids that restrict this seeker (for filtering).
        /// </summary>
        Task<IEnumerable<int>> GetRestrictedProviderIdsForSeekerAsync(int seekerId);
    }
}