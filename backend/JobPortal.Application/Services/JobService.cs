using JobPortal.Application.DTOs;
using JobPortal.Application.Interfaces;
using JobPortal.Domain.Entities;

namespace JobPortal.Application.Services
{
    public class JobService : IJobService
    {
        private readonly IJobRepository _jobRepository;

        public JobService(IJobRepository jobRepository)
        {
            _jobRepository = jobRepository;
        }

        public async Task<IEnumerable<Job>> GetAllJobsAsync()
        {
            return await _jobRepository.GetAllJobsAsync();
        }

        public async Task CreateJobAsync(CreateJobDto dto, int providerId)
        {
            var job = new Job
            {
                Title = dto.Title,
                Description = dto.Description,
                Budget = dto.Budget,
                Location = dto.Location,
                ProviderId = providerId,
                Skills = dto.Skills ?? ""
            };

            await _jobRepository.CreateJobAsync(job);
        }

        public async Task<List<Job>> GetJobsByProviderId(int providerId)
        {
            return await _jobRepository.GetJobsByProviderId(providerId);
        }
    }
}