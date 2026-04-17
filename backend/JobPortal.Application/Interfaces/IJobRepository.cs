using JobPortal.Domain.Entities;

namespace JobPortal.Application.Interfaces
{
    public interface IJobRepository
    {
        // ✅ JOB METHODS
        Task<IEnumerable<Job>> GetAllJobsAsync();
        Task<Job?> GetJobByIdAsync(int id);
        Task<Job> CreateJobAsync(Job job);
        Task<bool> DeleteJobAsync(int id);

        // ✅ APPLICATION METHODS

        // For Provider (see applicants on their jobs)
        Task<IEnumerable<JobPortal.Domain.Entities.Application>> GetApplicationsByProviderIdAsync(int providerId);

        // 🔥 NEW (CRITICAL FIX)
        Task<IEnumerable<JobPortal.Domain.Entities.Application>> GetApplicationsBySeekerIdAsync(int seekerId);

        Task<JobPortal.Domain.Entities.Application> ApplyToJobAsync(JobPortal.Domain.Entities.Application application);
        Task<bool> UpdateApplicationStatusAsync(int applicationId, string status);
        Task<List<Job>> GetJobsByProviderId(int providerId);

        Task<bool> HasUserApplied(int jobId, int userId);

    }
}