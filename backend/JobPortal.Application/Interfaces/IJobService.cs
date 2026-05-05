using JobPortal.Application.DTOs;
using JobPortal.Domain.Entities;

namespace JobPortal.Application.Interfaces
{
    public interface IJobService
    {
        Task<IEnumerable<JobDto>> GetAllJobsAsync();
        Task CreateJobAsync(CreateJobDto dto, int providerId);
        Task<List<Job>> GetJobsByProviderId(int providerId);
        Task UpdateJobAsync(int jobId, UpdateJobDto dto, int userId);
        Task DeleteJobAsync(int jobId, int userId);
        Task<Job> GetJobByIdAsync(int jobId);

        Task<(List<JobDto> jobs, int total)> GetPagedJobsAsync(int page, int pageSize);
        Task<(List<JobDto> jobs, int total)> GetPagedJobsForAdminAsync(int page, int pageSize);

        // 🔥 NEW (PROVIDER PAGINATION)
        Task<(List<JobDto> jobs, int total)> GetPagedJobsByProviderAsync(int providerId, int page, int pageSize);

        Task<List<BulkJobResultDto>> BulkCreateAsync(List<CreateJobDto> jobs,int providerId);
    }
}