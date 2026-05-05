//using JobPortal.Application.DTOs;
//using JobPortal.Application.Interfaces;
//using JobPortal.Domain.Entities;

//namespace JobPortal.Application.Services
//{
//    public class JobService : IJobService
//    {
//        private readonly IJobRepository _jobRepository;

//        public JobService(IJobRepository jobRepository)
//        {
//            _jobRepository = jobRepository;
//        }

//        //public async Task<IEnumerable<Job>> GetAllJobsAsync()
//        //{
//        //    return await _jobRepository.GetAllJobsAsync();
//        //}

//        // 🔹 GET ALL JOBS
//        public async Task<IEnumerable<JobDto>> GetAllJobsAsync()
//        {
//            var jobs = await _jobRepository.GetAllJobsAsync();

//            return jobs.Select(j => new JobDto
//            {
//                Id = j.Id,
//                Title = j.Title,
//                Description = j.Description,
//                Budget = j.Budget,
//                Location = j.Location,
//                Skills = j.Skills,
//                CreatedAt = j.CreatedAt
//            });
//        }


//        // Create Job
//        public async Task CreateJobAsync(CreateJobDto dto, int providerId)
//        {
//            var job = new Job
//            {
//                Title = dto.Title,
//                Description = dto.Description,
//                Budget = dto.Budget,
//                Location = dto.Location,
//                ProviderId = providerId,
//                Skills = dto.Skills ?? ""
//            };

//            await _jobRepository.CreateJobAsync(job);
//        }


//        //Get Provider's Job
//        public async Task<List<Job>> GetJobsByProviderId(int providerId)
//        {
//            return await _jobRepository.GetJobsByProviderId(providerId);
//        }

//        // 🔥 UPDATE JOB
//        public async Task UpdateJobAsync(int jobId, UpdateJobDto dto, int userId)
//        {
//            var job = await _jobRepository.GetJobByIdAsync(jobId);

//            if (job == null)
//                throw new Exception("Job not found");

//            if (job.ProviderId != userId)
//                throw new UnauthorizedAccessException("You can only edit your own jobs");

//            job.Title = dto.Title;
//            job.Description = dto.Description;
//            job.Budget = dto.Budget;
//            job.Location = dto.Location;
//            job.Skills = dto.Skills;

//            await _jobRepository.UpdateJobAsync(job);
//        }

//        // 🔥 DELETE JOB
//        public async Task DeleteJobAsync(int jobId, int userId)
//        {
//            var job = await _jobRepository.GetJobByIdAsync(jobId);

//            if (job == null)
//                throw new Exception("Job not found");

//            if (job.ProviderId != userId)
//                throw new UnauthorizedAccessException("You can only delete your own jobs");

//            await _jobRepository.DeleteJobAsync(jobId);
//        }

//        public async Task<Job> GetJobByIdAsync(int jobId)
//        {
//            return await _jobRepository.GetJobByIdAsync(jobId);
//        }

//        public async Task<(List<Job> jobs, int total)> GetPagedJobsAsync(int page, int pageSize)
//        {
//            return await _jobRepository.GetPagedJobsAsync(page, pageSize);
//        }

//        public async Task<(List<JobDto> jobs, int total)> GetPagedJobsForAdminAsync(int page, int pageSize)
//        {
//            return await _jobRepository.GetPagedJobsForAdminAsync(page, pageSize);
//        }

//    }
//}

using JobPortal.Application.DTOs;
using JobPortal.Application.Exceptions;
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

        public async Task<IEnumerable<JobDto>> GetAllJobsAsync()
        {
            var jobs = await _jobRepository.GetAllJobsAsync();
            return jobs.Select(MapToDto);
        }

        public async Task CreateJobAsync(CreateJobDto dto, int providerId)
        {

            if (dto == null)
                throw new BadRequestException("Invalid job data");

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

        // 🔥 KEEP OLD METHOD
        public async Task<List<Job>> GetJobsByProviderId(int providerId)
        {
            return await _jobRepository.GetJobsByProviderId(providerId);
        }

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

        public async Task DeleteJobAsync(int jobId, int userId)
        {
            var job = await _jobRepository.GetJobByIdAsync(jobId);

            if (job == null)
                throw new Exception("Job not found");

            if (job.ProviderId != userId)
                throw new UnauthorizedAccessException("You can only delete your own jobs");

            await _jobRepository.DeleteJobAsync(jobId);
        }

        public async Task<Job> GetJobByIdAsync(int jobId)
        {
            return await _jobRepository.GetJobByIdAsync(jobId);
        }

        // 🔥 PAGINATED (USER)
        public async Task<(List<JobDto> jobs, int total)> GetPagedJobsAsync(int page, int pageSize)
        {
            var (jobs, total) = await _jobRepository.GetPagedJobsAsync(page, pageSize);
            return (jobs.Select(MapToDto).ToList(), total);
        }

        // 🔥 PAGINATED (ADMIN)
        public async Task<(List<JobDto> jobs, int total)> GetPagedJobsForAdminAsync(int page, int pageSize)
        {
            return await _jobRepository.GetPagedJobsForAdminAsync(page, pageSize);
        }

        // 🔥 NEW (PROVIDER PAGINATION)
        public async Task<(List<JobDto> jobs, int total)> GetPagedJobsByProviderAsync(
            int providerId,
            int page,
            int pageSize)
        {
            var (jobs, total) =
                await _jobRepository.GetPagedJobsByProviderIdAsync(providerId, page, pageSize);

            return (jobs.Select(MapToDto).ToList(), total);
        }

        // 🔹 CENTRAL MAPPING
        private static JobDto MapToDto(Job j)
        {
            return new JobDto
            {
                Id = j.Id,
                Title = j.Title,
                Description = j.Description,
                Budget = j.Budget,
                Location = j.Location,
                CreatedAt = j.CreatedAt,
                Skills = j.Skills,
                ProviderName = j.Provider?.Name,
                ProviderEmail = j.Provider?.Email
            };
        }

        public async Task<List<BulkJobResultDto>> BulkCreateAsync(
    List<CreateJobDto> jobs,
    int providerId)
        {
            if (jobs == null || !jobs.Any())
                throw new BadRequestException("No jobs provided");

            var results = new List<BulkJobResultDto>();

            foreach (var job in jobs)
            {
                try
                {
                    // 🔥 Validation (minimal but important)
                    if (string.IsNullOrWhiteSpace(job.Title))
                        throw new BadRequestException("Title is required");

                    if (job.Budget <= 0)
                        throw new BadRequestException("Budget must be greater than 0");

                    // 🔥 Map bulk DTO → existing DTO
                    var dto = new CreateJobDto
                    {
                        Title = job.Title,
                        Description = job.Description,
                        Budget = job.Budget,
                        Location = job.Location,
                        Skills = job.Skills != null
                                ? string.Join(",", job.Skills)
                                : ""
                    };

                    // 🔥 Reuse your existing logic
                    await CreateJobAsync(dto, providerId);

                    results.Add(new BulkJobResultDto
                    {
                        Title = job.Title,
                        Status = "Success",
                        Error = null
                    });
                }
                catch (Exception ex)
                {
                    // 🔥 IMPORTANT: DO NOT throw → collect error per row
                    results.Add(new BulkJobResultDto
                    {
                        Title = job.Title ?? "Unknown",
                        Status = "Failed",
                        Error = ex.Message
                    });
                }
            }

            return results;
        }
    }
}