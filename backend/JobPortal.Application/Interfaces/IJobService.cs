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

    }
}