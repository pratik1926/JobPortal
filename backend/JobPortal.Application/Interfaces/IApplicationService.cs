using JobPortal.Domain.Entities;
using ApplicationEntity = JobPortal.Domain.Entities.Application;
namespace JobPortal.Application.Interfaces
{
    public interface IApplicationService
    {
        Task ApplyToJobAsync(int jobId, int seekerId);
        Task<IEnumerable<ApplicationEntity>> GetMyApplicationsAsync(int seekerId);
        Task<IEnumerable<ApplicationEntity>> GetApplicationsForProviderAsync(int providerId);
        Task UpdateApplicationStatusAsync(int applicationId, string status, int providerId);
    }
}