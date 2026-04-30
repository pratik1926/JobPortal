using JobPortal.Application.Interfaces;
using JobPortal.Domain.Entities;
using JobPortal.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using ApplicationEntity = JobPortal.Domain.Entities.Application;

namespace JobPortal.Infrastructure.Repositories
{
    public class JobRepository : IJobRepository
    {
        private readonly JobPortalDbContext _context;

        public JobRepository(JobPortalDbContext context)
        {
            _context = context;
        }

        // ✅ GET ALL JOBS
        public async Task<IEnumerable<Job>> GetAllJobsAsync()
        {
            return await _context.Jobs.ToListAsync();
        }

        // ✅ GET JOB BY ID
        public async Task<Job?> GetJobByIdAsync(int id)
        {
            return await _context.Jobs.FindAsync(id);
        }

        // ✅ CREATE JOB
        public async Task<Job> CreateJobAsync(Job job)
        {
            await _context.Jobs.AddAsync(job);
            await _context.SaveChangesAsync();
            return job;
        }

        // ✅ DELETE JOB
        public async Task<bool> DeleteJobAsync(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return false;

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();
            return true;
        }

        // ✅ GET APPLICATIONS BY PROVIDER (for provider dashboard)
        public async Task<IEnumerable<JobPortal.Domain.Entities.Application>> GetApplicationsByProviderIdAsync(int providerId)
        {
            return await _context.Applications
                .Include(a => a.Job)
                .Include(a => a.Seeker)
                .Where(a => a.Job.ProviderId == providerId)
                .OrderByDescending(a => a.AppliedAt)
                .ToListAsync();
        }

        // 🔥 NEW: GET APPLICATIONS BY SEEKER (CRITICAL FIX)
        public async Task<IEnumerable<JobPortal.Domain.Entities.Application>> GetApplicationsBySeekerIdAsync(int seekerId)
        {
            return await _context.Applications
                .Include(a => a.Job)
                .Where(a => a.SeekerId == seekerId)
                .ToListAsync();
        }

        // ✅ APPLY TO JOB
        public async Task<JobPortal.Domain.Entities.Application> ApplyToJobAsync(JobPortal.Domain.Entities.Application application)
        {
            await _context.Applications.AddAsync(application);
            await _context.SaveChangesAsync();
            return application;
        }

        // ✅ UPDATE APPLICATION STATUS
        public async Task<bool> UpdateApplicationStatusAsync(int applicationId, string status)
        {
            var app = await _context.Applications.FindAsync(applicationId);
            if (app == null) return false;

            app.Status = status;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Job>> GetJobsByProviderId(int providerId)
        {
            return await _context.Jobs
                .Include(j => j.Provider)
                .Where(j => j.ProviderId == providerId)
                .ToListAsync();
        }

        public async Task<bool> HasUserApplied(int jobId, int userId)
        {
            return await _context.Applications
                .AnyAsync(a => a.JobId == jobId && a.SeekerId == userId);
        }

        public async Task<ApplicationEntity> GetApplicationByIdAsync(int applicationId)
        {
            return await _context.Applications
                .Include(a => a.Job) // 🔥 VERY IMPORTANT
                .FirstOrDefaultAsync(a => a.Id == applicationId);
        }

        public async Task UpdateJobAsync(Job job)
        {
            _context.Jobs.Update(job);
            await _context.SaveChangesAsync();
        }

        public async Task<List<JobDto>> GetAllJobsForAdminAsync()
        {
            return await _context.Jobs
        .Include(j => j.Provider)
        .Select(j => new JobDto
        {
            Id = j.Id,
            Title = j.Title,
            Description = j.Description,
            Budget = j.Budget,
            Location = j.Location,
            CreatedAt = j.CreatedAt,
            Skills = j.Skills,
            ProviderName = j.Provider.Name,
            ProviderEmail = j.Provider.Email
        })
        .OrderByDescending(j => j.CreatedAt)
        .ToListAsync();
        }

        public async Task<(List<Job> jobs, int total)> GetPagedJobsAsync(int page, int pageSize)
        {
            var query = _context.Jobs
                .Include(j => j.Provider); // 🔥 needed for DTO

            var total = await query.CountAsync();

            var jobs = await query
                .OrderByDescending(j => j.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (jobs, total);
        }

        public async Task<(List<JobDto> jobs, int total)> GetPagedJobsForAdminAsync(int page, int pageSize)
        {
            var query = _context.Jobs
                .Include(j => j.Provider);

            var total = await query.CountAsync();

            var jobs = await query
                .OrderByDescending(j => j.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(j => new JobDto
                {
                    Id = j.Id,
                    Title = j.Title,
                    Description = j.Description,
                    Budget = j.Budget,
                    Location = j.Location,
                    CreatedAt = j.CreatedAt,
                    Skills = j.Skills,
                    ProviderName = j.Provider.Name,
                    ProviderEmail = j.Provider.Email
                })
                .ToListAsync();

            return (jobs, total);
        }

        public async Task<(List<ApplicationEntity> applications, int total)>
        GetPagedApplicationsByProviderIdAsync(int providerId, int page, int pageSize)
        {
            var query = _context.Applications
                .Include(a => a.Job)
                .Include(a => a.Seeker)
                .Where(a => a.Job.ProviderId == providerId);

            var total = await query.CountAsync();

            var applications = await query
                .OrderByDescending(a => a.AppliedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (applications, total);
        }
        public async Task<(List<Job> jobs, int total)> GetPagedJobsByProviderIdAsync(
    int providerId,
    int page,
    int pageSize)
        {
            var query = _context.Jobs
                .Include(j => j.Provider)
                .Where(j => j.ProviderId == providerId);

            var total = await query.CountAsync();

            var jobs = await query
                .OrderByDescending(j => j.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (jobs, total);
        }

    }
}
