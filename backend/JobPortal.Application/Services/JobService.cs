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

        //public async Task<IEnumerable<Job>> GetAllJobsAsync()
        //{
        //    return await _jobRepository.GetAllJobsAsync();
        //}

        // 🔹 GET ALL JOBS
        public async Task<IEnumerable<JobDto>> GetAllJobsAsync()
        {
            var jobs = await _jobRepository.GetAllJobsAsync();

            return jobs.Select(j => new JobDto
            {
                Id = j.Id,
                Title = j.Title,
                Description = j.Description,
                Budget = j.Budget,
                Location = j.Location,
                Skills = j.Skills,
                CreatedAt = j.CreatedAt
            });
        }


        // Create Job
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


        //Get Provider's Job
        public async Task<List<Job>> GetJobsByProviderId(int providerId)
        {
            return await _jobRepository.GetJobsByProviderId(providerId);
        }

        // 🔥 UPDATE JOB
        public async Task UpdateJobAsync(int jobId, UpdateJobDto dto, int userId)
        {
            var job = await _jobRepository.GetJobByIdAsync(jobId);

            if (job == null)
                throw new Exception("Job not found");

            if (job.ProviderId != userId)
                throw new UnauthorizedAccessException("You can only edit your own jobs");

            job.Title = dto.Title;
            job.Description = dto.Description;
            job.Budget = dto.Budget;
            job.Location = dto.Location;
            job.Skills = dto.Skills;

            await _jobRepository.UpdateJobAsync(job);
        }

        // 🔥 DELETE JOB
        public async Task DeleteJobAsync(int jobId, int userId)
        {
            var job = await _jobRepository.GetJobByIdAsync(jobId);

            if (job == null)
                throw new Exception("Job not found");

            if (job.ProviderId != userId)
                throw new UnauthorizedAccessException("You can only delete your own jobs");

            await _jobRepository.DeleteJobAsync(jobId);
        }
    }
}