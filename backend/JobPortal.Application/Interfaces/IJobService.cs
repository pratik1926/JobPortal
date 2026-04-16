using JobPortal.Application.DTOs;
using JobPortal.Domain.Entities;

namespace JobPortal.Application.Interfaces
{
    public interface IJobService
    {
        Task<IEnumerable<Job>> GetAllJobsAsync();
        Task CreateJobAsync(CreateJobDto dto, int providerId);
    }
}