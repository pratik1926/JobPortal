
using JobPortal.Application.Interfaces;
using JobPortal.Application.DTOs;
using JobPortal.Domain.Entities;
using ApplicationEntity = JobPortal.Domain.Entities.Application;
using JobPortal.Application.Exceptions;

namespace JobPortal.Application.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IJobRepository _jobRepository;
        private readonly IFileService _fileService;
        private readonly INotificationService _notificationService;
        private readonly IUserRepository _userRepository;
        // ✅ ONLY repository injection (clean architecture)
        public ApplicationService(IJobRepository jobRepository, IFileService fileService, INotificationService notificationService, IUserRepository userRepository)
        {
            _jobRepository = jobRepository;
            _fileService = fileService;
            _notificationService = notificationService;
            _userRepository = userRepository;
        }

     

        // 🔥 APPLY TO JOB (CLEAN + CORRECT)
        public async Task ApplyToJobAsync(int jobId, int seekerId, ApplyJobDto dto)
        {
            // 🔒 Prevent duplicate application
            var alreadyApplied = await _jobRepository.HasUserApplied(jobId, seekerId);
            if (alreadyApplied)
                throw new BadRequestException("You have already applied to this job");

            // 🔒 Validate file
            if (dto.Resume == null || dto.Resume.Length == 0)
                throw new BadRequestException("Resume is required");

            var extension = Path.GetExtension(dto.FileName).ToLower();
            if (extension != ".pdf")
                throw new Exception("Only PDF files are allowed");

            // 🔥 Save file
            var resumeUrl = await _fileService.SaveResumeAsync(dto.Resume, dto.FileName);

            // 🔥 Create application entity
            var application = new ApplicationEntity
            {
                JobId = jobId,
                SeekerId = seekerId,
                ResumeUrl = resumeUrl,
                CoverLetter = dto.CoverLetter,
                Status = "Applied",
                AppliedAt = DateTime.UtcNow
            };

            await _jobRepository.ApplyToJobAsync(application);

            // 🔥 GET JOB (for providerId + title)
            var job = await _jobRepository.GetJobByIdAsync(jobId);
            var seeker = await _userRepository.GetUserByIdAsync(seekerId);

            // 🔔 NOTIFY SEEKER (self confirmation)
            await _notificationService.CreateAsync(new CreateNotificationDto
            {
                UserId = seekerId,
                Message = $"You successfully applied to '{job.Title}'"
            });

            // 🔔 NOTIFY PROVIDER
            await _notificationService.CreateAsync(new CreateNotificationDto
            {
                UserId = job.ProviderId,
                Message = $"A new applicant {seeker.Name} has applied to your job '{job.Title}'"
            });
        }

        // 🔹 GET MY APPLICATIONS
        public async Task<IEnumerable<MyApplicationDto>> GetMyApplicationsAsync(int seekerId)
        {
            var apps = await _jobRepository.GetApplicationsBySeekerIdAsync(seekerId);

            return apps.Select(a => new MyApplicationDto
            {
                Id = a.Id,
                JobId = a.JobId,
                JobTitle = a.Job.Title,
                Location = a.Job.Location,
                Status = a.Status,
                AppliedAt = a.AppliedAt,
                ResumeUrl = a.ResumeUrl,
                CoverLetter = a.CoverLetter
            });
        }

        // 🔹 GET PROVIDER APPLICATIONS
        //public async Task<IEnumerable<ApplicationEntity>> GetApplicationsForProviderAsync(int providerId)
        //{
        //    return await _jobRepository.GetApplicationsByProviderIdAsync(providerId);
        //}
        //public async Task<IEnumerable<ApplicationProviderDto>> GetApplicationsForProviderAsync(int providerId)
        //{
        //    var apps = await _jobRepository.GetApplicationsByProviderIdAsync(providerId);

        //    return apps.Select(a => new ApplicationProviderDto
        //    {
        //        Id = a.Id,
        //        SeekerEmail = a.Seeker?.Email,
        //        JobTitle = a.Job?.Title,
        //        Status = a.Status,
        //        AppliedAt = a.AppliedAt,
        //        ResumeUrl = a.ResumeUrl,
        //        CoverLetter = a.CoverLetter
        //    }).ToList();
        //}

        public async Task<(List<ApplicationProviderDto> applications, int total)>
GetPagedApplicationsForProviderAsync(int providerId, int page, int pageSize)
        {
            var result = await _jobRepository.GetPagedApplicationsByProviderIdAsync(
                providerId,
                page,
                pageSize
            );

            var apps = result.applications;
            var total = result.total;

            var mapped = apps.Select(a => new ApplicationProviderDto
            {
                Id = a.Id,
                SeekerEmail = a.Seeker?.Email,
                JobTitle = a.Job?.Title,
                Status = a.Status,
                AppliedAt = a.AppliedAt,
                ResumeUrl = a.ResumeUrl,
                CoverLetter = a.CoverLetter
            }).ToList();

            return (mapped, total);
        }

        public async Task<(List<ApplicationProviderDto> applications, int total)>
GetPagedApplicationsForSeekerAsync(int seekerId, int page, int pageSize)
        {
            var (apps, total) =
                await _jobRepository.GetPagedApplicationsBySeekerIdAsync(
                    seekerId,
                    page,
                    pageSize
                );

            var result = apps.Select(a => new ApplicationProviderDto
            {
                Id = a.Id,
                SeekerEmail = a.Seeker?.Email,
                JobTitle = a.Job?.Title,
                Status = a.Status,
                AppliedAt = a.AppliedAt,
                ResumeUrl = a.ResumeUrl,
                CoverLetter = a.CoverLetter
            }).ToList();

            return (result, total);
        }

        // 🔥 STATE MACHINE (NEW)
        private bool IsValidTransition(string currentStatus, string newStatus)
        {
            return currentStatus switch
            {
                "Applied" => newStatus == "Approved" || newStatus == "Rejected",
                "Approved" => false,
                "Rejected" => false,
                _ => false
            };
        }

       

        public async Task UpdateApplicationStatusAsync(int applicationId, string newStatus, int providerId)
        {
            var app = await _jobRepository.GetApplicationByIdAsync(applicationId);

            if (app == null || app.Job.ProviderId != providerId)
                throw new UnauthorizedAccessException("You are not allowed to update this application");

            // 🔥 STATE MACHINE CHECK
            if (!IsValidTransition(app.Status, newStatus))
            {
                throw new InvalidOperationException($"Invalid status transition: {app.Status} → {newStatus}");
            }

            // ✅ UPDATE STATUS
            await _jobRepository.UpdateApplicationStatusAsync(applicationId, newStatus);

            // 🔔 NOTIFY SEEKER
            var message = newStatus == "Approved"
                ? $"Your application for '{app.Job.Title}' has been approved 🎉"
                : newStatus == "Rejected"
                ? $"Your application for '{app.Job.Title}' was rejected"
                : $"Your application status for '{app.Job.Title}' is now {newStatus}";

            await _notificationService.CreateAsync(new CreateNotificationDto
            {
                UserId = app.SeekerId,
                Message = message
            });
        }


        // 🔥 PREVENT DUPLICATE APPLY (CLEAN WAY)
        public async Task<bool> HasUserApplied(int jobId, int userId)
        {
            return await _jobRepository.HasUserApplied(jobId, userId);
        }
    }
}