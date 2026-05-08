using JobPortal.Application.DTOs.Moderation;
using JobPortal.Application.Interfaces;
using JobPortal.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace JobPortal.Application.Services
{
    public class ProviderRestrictionService : IProviderRestrictionService
    {
        private readonly IProviderRestrictionRepository _repository;
        private readonly IReportRepository _reportRepository;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<ProviderRestrictionService> _logger;

        public ProviderRestrictionService(
            IProviderRestrictionRepository repository,
            IReportRepository reportRepository,
            IUserRepository userRepository,
            ILogger<ProviderRestrictionService> logger)
        {
            _repository = repository;
            _reportRepository = reportRepository;
            _userRepository = userRepository;
            _logger = logger;
        }

        public async Task<ProviderRestrictionDto> CreateRestrictionAsync(CreateProviderRestrictionDto dto, int adminId)
        {
            // defensive validation
            var provider = await _userRepository.GetUserByIdAsync(dto.ProviderId);
            if (provider == null || provider.Role != "Provider")
                throw new InvalidOperationException("Provider not found");

            var seeker = await _userRepository.GetUserByIdAsync(dto.SeekerId);
            if (seeker == null || seeker.Role != "Seeker")
                throw new InvalidOperationException("Seeker not found");

            // Idempotency: return existing if present
            var exists = await _repository.GetByProviderAndSeekerAsync(dto.ProviderId, dto.SeekerId);
            if (exists != null)
            {
                _logger.LogInformation("ProviderRestriction already exists: providerId={ProviderId} seekerId={SeekerId}", dto.ProviderId, dto.SeekerId);
                return new ProviderRestrictionDto
                {
                    Id = exists.Id,
                    ProviderId = exists.ProviderId,
                    SeekerId = exists.SeekerId,
                    ReportId = exists.ReportId,
                    CreatedAtUtc = exists.CreatedAtUtc
                };
            }

            var entity = new ProviderRestriction
            {
                ProviderId = dto.ProviderId,
                SeekerId = dto.SeekerId,
                ReportId = dto.ReportId,
                CreatedAtUtc = DateTime.UtcNow
            };

            // create (repository performs SaveChanges)
            var created = await _repository.CreateAsync(entity);

            _logger.LogInformation("ProviderRestriction created by adminId={AdminId} providerId={ProviderId} seekerId={SeekerId} reportId={ReportId}",
                adminId, dto.ProviderId, dto.SeekerId, dto.ReportId);

            // moderation audit log can be added here (future)
            return new ProviderRestrictionDto
            {
                Id = created.Id,
                ProviderId = created.ProviderId,
                SeekerId = created.SeekerId,
                ReportId = created.ReportId,
                CreatedAtUtc = created.CreatedAtUtc
            };
        }

        public async Task<ProviderRestrictionDto> CreateFromReportAsync(int reportId, int adminId)
        {
            var report = await _reportRepository.GetByIdAsync(reportId);
            if (report == null)
                throw new InvalidOperationException("Report not found");

            var dto = new CreateProviderRestrictionDto
            {
                ProviderId = report.ReporterId,
                SeekerId = report.ReportedUserId,
                ReportId = report.Id
            };

            return await CreateRestrictionAsync(dto, adminId);
        }

        public async Task<bool> IsSeekerRestrictedForProviderAsync(int seekerId, int providerId)
        {
            return await _repository.ExistsAsync(providerId, seekerId);
        }

        public async Task<IEnumerable<int>> GetRestrictedProviderIdsForSeekerAsync(int seekerId)
        {
            return await _repository.GetRestrictedProviderIdsForSeekerAsync(seekerId);
        }
    }
}