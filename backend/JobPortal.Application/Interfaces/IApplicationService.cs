namespace JobPortal.Application.Interfaces
{
    public interface IApplicationService
    {
        Task ApplyToJobAsync(int jobId, int seekerId, ApplyJobDto dto);

        Task<IEnumerable<JobPortal.Domain.Entities.Application>> GetMyApplicationsAsync(int seekerId);

        Task<IEnumerable<JobPortal.Domain.Entities.Application>> GetApplicationsForProviderAsync(int providerId);

        Task UpdateApplicationStatusAsync(int applicationId, string status, int providerId);
    }
}