using JobPortal.Domain.Entities;
using ApplicationEntity = JobPortal.Domain.Entities.Application;

namespace JobPortal.Application.Interfaces
{
    public interface IJobRepository
    {
        // ✅ JOB METHODS
        Task<IEnumerable<Job>> GetAllJobsAsync();
        Task<Job?> GetJobByIdAsync(int id);
        Task<Job> CreateJobAsync(Job job);
        Task<bool> DeleteJobAsync(int id);
        Task UpdateJobAsync(Job job);

        // ✅ APPLICATION METHODS

        // For Provider (see applicants on their jobs)
        Task<IEnumerable<JobPortal.Domain.Entities.Application>> GetApplicationsByProviderIdAsync(int providerId);

        // 🔥 NEW (CRITICAL FIX)
        Task<IEnumerable<JobPortal.Domain.Entities.Application>> GetApplicationsBySeekerIdAsync(int seekerId);

        Task<JobPortal.Domain.Entities.Application> ApplyToJobAsync(JobPortal.Domain.Entities.Application application);
        Task<bool> UpdateApplicationStatusAsync(int applicationId, string status);
        Task<List<Job>> GetJobsByProviderId(int providerId);

        Task<bool> HasUserApplied(int jobId, int userId);

        Task<ApplicationEntity> GetApplicationByIdAsync(int applicationId);

        Task<List<JobDto>> GetAllJobsForAdminAsync();

        Task<(List<Job> jobs, int total)> GetPagedJobsAsync(int page, int pageSize);

        Task<(List<JobDto> jobs, int total)> GetPagedJobsForAdminAsync(int page, int pageSize);
        Task<(List<Job> jobs, int total)> GetPagedJobsByProviderIdAsync(
            int providerId,
            int page,
            int pageSize
        );

        Task<(List<JobPortal.Domain.Entities.Application> applications, int total)>
                                GetPagedApplicationsByProviderIdAsync(int providerId, int page, int pageSize);

        Task<(List<JobPortal.Domain.Entities.Application> applications, int total)>
                                GetPagedApplicationsBySeekerIdAsync(int seekerId, int page, int pageSize);

        Task<IEnumerable<ApplicationEntity>> GetAllApplicationsAsync();
    }
}