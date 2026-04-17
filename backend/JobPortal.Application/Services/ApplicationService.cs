//using JobPortal.Application.Interfaces;
//using JobPortal.Application.DTOs;
//using JobPortal.Domain.Entities;
//using ApplicationEntity = JobPortal.Domain.Entities.Application;
//using JobPortal

//namespace JobPortal.Application.Services
//{
//    public class ApplicationService : IApplicationService
//    {
//        private readonly IJobRepository _jobRepository;
//        private readonly JobPortalDbContext _context;
//        public ApplicationService(JobPortalDbContext context)
//        {
//            _context = context;
//        }

//        public ApplicationService(IJobRepository jobRepository)
//        {
//            _jobRepository = jobRepository;
//        }

//        // 🔥 UPDATED METHOD (NOW ACCEPTS DTO)
//        public async Task ApplyToJobAsync(int jobId, int seekerId, ApplyJobDto dto)
//        {
//            var application = new ApplicationEntity
//            {
//                JobId = jobId,
//                SeekerId = seekerId,
//                ResumeUrl = dto.ResumeUrl,
//                CoverLetter = dto.CoverLetter,
//                Status = "Applied",
//                AppliedAt = DateTime.UtcNow
//            };

//            await _jobRepository.ApplyToJobAsync(application);
//        }

//        public async Task<IEnumerable<ApplicationEntity>> GetMyApplicationsAsync(int seekerId)
//        {
//            var apps = await _jobRepository.GetApplicationsBySeekerIdAsync(seekerId);
//            return apps.Where(a => a.SeekerId == seekerId);
//        }

//        public async Task<IEnumerable<ApplicationEntity>> GetApplicationsForProviderAsync(int providerId)
//        {
//            return await _jobRepository.GetApplicationsByProviderIdAsync(providerId);
//        }

//        public async Task UpdateApplicationStatusAsync(int applicationId, string status, int providerId)
//        {
//            var apps = await _jobRepository.GetApplicationsByProviderIdAsync(providerId);

//            var app = apps.FirstOrDefault(a => a.Id == applicationId);

//            if (app == null)
//                throw new UnauthorizedAccessException("You are not allowed to update this application");

//            await _jobRepository.UpdateApplicationStatusAsync(applicationId, status);
//        }

//        public async Task<bool> HasUserApplied(int jobId, int userId)
//        {
//            return await _context.Applications
//                .AnyAsync(a => a.JobId == jobId && a.SeekerId == userId);
//        }
//    }
//}

using JobPortal.Application.Interfaces;
using JobPortal.Application.DTOs;
using JobPortal.Domain.Entities;
using ApplicationEntity = JobPortal.Domain.Entities.Application;

namespace JobPortal.Application.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IJobRepository _jobRepository;

        // ✅ ONLY repository injection (clean architecture)
        public ApplicationService(IJobRepository jobRepository)
        {
            _jobRepository = jobRepository;
        }

        // 🔥 APPLY TO JOB
        public async Task ApplyToJobAsync(int jobId, int seekerId, ApplyJobDto dto)
        {
            var application = new ApplicationEntity
            {
                JobId = jobId,
                SeekerId = seekerId,
                ResumeUrl = dto.ResumeUrl,
                CoverLetter = dto.CoverLetter,
                Status = "Applied",
                AppliedAt = DateTime.UtcNow
            };

            await _jobRepository.ApplyToJobAsync(application);
        }

        // 🔹 GET MY APPLICATIONS
        public async Task<IEnumerable<ApplicationEntity>> GetMyApplicationsAsync(int seekerId)
        {
            return await _jobRepository.GetApplicationsBySeekerIdAsync(seekerId);
        }

        // 🔹 GET PROVIDER APPLICATIONS
        public async Task<IEnumerable<ApplicationEntity>> GetApplicationsForProviderAsync(int providerId)
        {
            return await _jobRepository.GetApplicationsByProviderIdAsync(providerId);
        }

        // 🔹 UPDATE STATUS
        public async Task UpdateApplicationStatusAsync(int applicationId, string status, int providerId)
        {
            var apps = await _jobRepository.GetApplicationsByProviderIdAsync(providerId);

            var app = apps.FirstOrDefault(a => a.Id == applicationId);

            if (app == null)
                throw new UnauthorizedAccessException("You are not allowed to update this application");

            await _jobRepository.UpdateApplicationStatusAsync(applicationId, status);
        }

        // 🔥 PREVENT DUPLICATE APPLY (CLEAN WAY)
        public async Task<bool> HasUserApplied(int jobId, int userId)
        {
            return await _jobRepository.HasUserApplied(jobId, userId);
        }
    }
}