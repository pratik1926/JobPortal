
////using JobPortal.Application.Interfaces;
////using JobPortal.Application.DTOs;
////using JobPortal.Domain.Entities;
////using ApplicationEntity = JobPortal.Domain.Entities.Application;
////using JobPortal.Application.Exceptions;

////namespace JobPortal.Application.Services
////{
////    public class ApplicationService : IApplicationService
////    {
////        private readonly IJobRepository _jobRepository;
////        private readonly IFileService _fileService;
////        private readonly INotificationService _notificationService;
////        private readonly IUserRepository _userRepository;
////        // ✅ ONLY repository injection (clean architecture)
////        public ApplicationService(IJobRepository jobRepository, IFileService fileService, INotificationService notificationService, IUserRepository userRepository)
////        {
////            _jobRepository = jobRepository;
////            _fileService = fileService;
////            _notificationService = notificationService;
////            _userRepository = userRepository;
////        }



////        // 🔥 APPLY TO JOB (CLEAN + CORRECT)
////        public async Task ApplyToJobAsync(int jobId, int seekerId, ApplyJobDto dto)
////        {
////            // 🔒 Prevent duplicate application
////            var alreadyApplied = await _jobRepository.HasUserApplied(jobId, seekerId);
////            if (alreadyApplied)
////                throw new BadRequestException("You have already applied to this job");

////            // 🔒 Validate file
////            if (dto.Resume == null || dto.Resume.Length == 0)
////                throw new BadRequestException("Resume is required");

////            var extension = Path.GetExtension(dto.FileName).ToLower();
////            if (extension != ".pdf")
////                throw new Exception("Only PDF files are allowed");

////            // 🔥 Save file
////            var resumeUrl = await _fileService.SaveResumeAsync(dto.Resume, dto.FileName);

////            // 🔥 Create application entity
////            var application = new ApplicationEntity
////            {
////                JobId = jobId,
////                SeekerId = seekerId,
////                ResumeUrl = resumeUrl,
////                CoverLetter = dto.CoverLetter,
////                Status = "Applied",
////                AppliedAt = DateTime.UtcNow
////            };

////            await _jobRepository.ApplyToJobAsync(application);

////            // 🔥 GET JOB (for providerId + title)
////            var job = await _jobRepository.GetJobByIdAsync(jobId);
////            var seeker = await _userRepository.GetUserByIdAsync(seekerId);

////            // 🔔 NOTIFY SEEKER (self confirmation)
////            await _notificationService.CreateAsync(new CreateNotificationDto
////            {
////                UserId = seekerId,
////                Message = $"You successfully applied to '{job.Title}'"
////            });

////            // 🔔 NOTIFY PROVIDER
////            await _notificationService.CreateAsync(new CreateNotificationDto
////            {
////                UserId = job.ProviderId,
////                Message = $"A new applicant {seeker.Name} has applied to your job '{job.Title}'"
////            });
////        }

////        // 🔹 GET MY APPLICATIONS
////        public async Task<IEnumerable<MyApplicationDto>> GetMyApplicationsAsync(int seekerId)
////        {
////            var apps = await _jobRepository.GetApplicationsBySeekerIdAsync(seekerId);

////            return apps.Select(a => new MyApplicationDto
////            {
////                Id = a.Id,
////                JobId = a.JobId,
////                JobTitle = a.Job.Title,
////                Location = a.Job.Location,
////                Status = a.Status,
////                AppliedAt = a.AppliedAt,
////                ResumeUrl = a.ResumeUrl,
////                CoverLetter = a.CoverLetter
////            });
////        }

////        // 🔹 GET PROVIDER APPLICATIONS
////        //public async Task<IEnumerable<ApplicationEntity>> GetApplicationsForProviderAsync(int providerId)
////        //{
////        //    return await _jobRepository.GetApplicationsByProviderIdAsync(providerId);
////        //}
////        //public async Task<IEnumerable<ApplicationProviderDto>> GetApplicationsForProviderAsync(int providerId)
////        //{
////        //    var apps = await _jobRepository.GetApplicationsByProviderIdAsync(providerId);

////        //    return apps.Select(a => new ApplicationProviderDto
////        //    {
////        //        Id = a.Id,
////        //        SeekerEmail = a.Seeker?.Email,
////        //        JobTitle = a.Job?.Title,
////        //        Status = a.Status,
////        //        AppliedAt = a.AppliedAt,
////        //        ResumeUrl = a.ResumeUrl,
////        //        CoverLetter = a.CoverLetter
////        //    }).ToList();
////        //}

////        public async Task<(List<ApplicationProviderDto> applications, int total)>
////GetPagedApplicationsForProviderAsync(int providerId, int page, int pageSize)
////        {
////            var result = await _jobRepository.GetPagedApplicationsByProviderIdAsync(
////                providerId,
////                page,
////                pageSize
////            );

////            var apps = result.applications;
////            var total = result.total;

////            var mapped = apps.Select(a => new ApplicationProviderDto
////            {
////                Id = a.Id,
////                SeekerEmail = a.Seeker?.Email,
////                JobTitle = a.Job?.Title,
////                Status = a.Status,
////                AppliedAt = a.AppliedAt,
////                ResumeUrl = a.ResumeUrl,
////                CoverLetter = a.CoverLetter
////            }).ToList();

////            return (mapped, total);
////        }

////        public async Task<(List<ApplicationProviderDto> applications, int total)>
////GetPagedApplicationsForSeekerAsync(int seekerId, int page, int pageSize)
////        {
////            var (apps, total) =
////                await _jobRepository.GetPagedApplicationsBySeekerIdAsync(
////                    seekerId,
////                    page,
////                    pageSize
////                );

////            var result = apps.Select(a => new ApplicationProviderDto
////            {
////                Id = a.Id,
////                SeekerEmail = a.Seeker?.Email,
////                JobTitle = a.Job?.Title,
////                Status = a.Status,
////                AppliedAt = a.AppliedAt,
////                ResumeUrl = a.ResumeUrl,
////                CoverLetter = a.CoverLetter
////            }).ToList();

////            return (result, total);
////        }

////        // 🔥 STATE MACHINE (NEW)
////        private bool IsValidTransition(string currentStatus, string newStatus)
////        {
////            return currentStatus switch
////            {
////                "Applied" => newStatus == "Approved" || newStatus == "Rejected",
////                "Approved" => false,
////                "Rejected" => false,
////                _ => false
////            };
////        }



////        public async Task UpdateApplicationStatusAsync(int applicationId, string newStatus, int providerId)
////        {
////            var app = await _jobRepository.GetApplicationByIdAsync(applicationId);

////            if (app == null || app.Job.ProviderId != providerId)
////                throw new UnauthorizedAccessException("You are not allowed to update this application");

////            // 🔥 STATE MACHINE CHECK
////            if (!IsValidTransition(app.Status, newStatus))
////            {
////                throw new InvalidOperationException($"Invalid status transition: {app.Status} → {newStatus}");
////            }

////            // ✅ UPDATE STATUS
////            await _jobRepository.UpdateApplicationStatusAsync(applicationId, newStatus);

////            // 🔔 NOTIFY SEEKER
////            var message = newStatus == "Approved"
////                ? $"Your application for '{app.Job.Title}' has been approved 🎉"
////                : newStatus == "Rejected"
////                ? $"Your application for '{app.Job.Title}' was rejected"
////                : $"Your application status for '{app.Job.Title}' is now {newStatus}";

////            await _notificationService.CreateAsync(new CreateNotificationDto
////            {
////                UserId = app.SeekerId,
////                Message = message
////            });
////        }


////        // 🔥 PREVENT DUPLICATE APPLY (CLEAN WAY)
////        public async Task<bool> HasUserApplied(int jobId, int userId)
////        {
////            return await _jobRepository.HasUserApplied(jobId, userId);
////        }
////    }
////}

//using JobPortal.Application.Interfaces;
//using JobPortal.Application.DTOs;
//using JobPortal.Domain.Entities;
//using ApplicationEntity = JobPortal.Domain.Entities.Application;
//using JobPortal.Application.Exceptions;
//using JobPortal.Application.DTOs.Email;
//using System.IO;

//namespace JobPortal.Application.Services
//{
//    public class ApplicationService : IApplicationService
//    {
//        private readonly IJobRepository _jobRepository;
//        private readonly IFileService _fileService;
//        private readonly INotificationService _notificationService;
//        private readonly IUserRepository _userRepository;
//        private readonly IEmailService _emailService;
//        private readonly IEmailTemplateRenderer _templateRenderer;

//        // ✅ ONLY repository injection (clean architecture)
//        public ApplicationService(
//            IJobRepository jobRepository,
//            IFileService fileService,
//            INotificationService notificationService,
//            IUserRepository userRepository,
//            IEmailService emailService,
//            IEmailTemplateRenderer templateRenderer)
//        {
//            _jobRepository = jobRepository;
//            _fileService = fileService;
//            _notificationService = notificationService;
//            _userRepository = userRepository;
//            _emailService = emailService;
//            _templateRenderer = templateRenderer;
//        }

//        // 🔥 APPLY TO JOB (CLEAN + CORRECT)
//        public async Task ApplyToJobAsync(int jobId, int seekerId, ApplyJobDto dto)
//        {
//            // 🔒 Prevent duplicate application
//            var alreadyApplied = await _jobRepository.HasUserApplied(jobId, seekerId);
//            if (alreadyApplied)
//                throw new BadRequestException("You have already applied to this job");

//            // 🔒 Validate file
//            if (dto.Resume == null || dto.Resume.Length == 0)
//                throw new BadRequestException("Resume is required");

//            var extension = Path.GetExtension(dto.FileName).ToLower();
//            if (extension != ".pdf")
//                throw new Exception("Only PDF files are allowed");

//            // 🔥 Save file
//            var resumeUrl = await _fileService.SaveResumeAsync(dto.Resume, dto.FileName);

//            // 🔥 Create application entity
//            var application = new ApplicationEntity
//            {
//                JobId = jobId,
//                SeekerId = seekerId,
//                ResumeUrl = resumeUrl,
//                CoverLetter = dto.CoverLetter,
//                Status = "Applied",
//                AppliedAt = DateTime.UtcNow
//            };

//            await _jobRepository.ApplyToJobAsync(application);

//            // 🔥 GET JOB (for providerId + title)
//            var job = await _jobRepository.GetJobByIdAsync(jobId);
//            var seeker = await _userRepository.GetUserByIdAsync(seekerId);

//            // 🔔 NOTIFY SEEKER (self confirmation)
//            await _notification_service_safe_create(seekerId, $"You successfully applied to '{job.Title}'");

//            // 🔔 NOTIFY PROVIDER
//            await _notification_service_safe_create(job.ProviderId, $"A new applicant {seeker.Name} has applied to your job '{job.Title}'");

//            // 🔥 SEND JOB APPLICATION EMAIL TO PROVIDER (best-effort)
//            try
//            {
//                if (!string.IsNullOrEmpty(job.Provider?.Email))
//                {
//                    // Prepare template model
//                    var model = new JobApplicationEmailDto
//                    {
//                        JobId = job.Id,
//                        JobTitle = job.Title,
//                        SeekerId = seekerId,
//                        SeekerName = seeker.Name,
//                        SeekerEmail = seeker.Email,
//                        ProfileSummary = seeker?.Name, // replace with a proper summary if available
//                        CoverLetter = dto.CoverLetter,
//                        AppliedAtUtc = application.AppliedAt,
//                        ResumeFileName = Path.GetFileName(resumeUrl ?? string.Empty)
//                    };

//                    // Render HTML
//                    var html = await _templateRenderer.RenderHtmlAsync("JobApplicationNotification", model);

//                    // Prepare attachment (read file bytes safely)
//                    EmailAttachmentDto? attachment = null;
//                    if (!string.IsNullOrEmpty(resumeUrl))
//                    {
//                        try
//                        {
//                            var fileBytes = await _fileService.GetFileBytesAsync(resumeUrl);
//                            attachment = new EmailAttachmentDto
//                            {
//                                FileName = Path.GetFileName(resumeUrl),
//                                ContentType = "application/pdf",
//                                Content = fileBytes
//                            };
//                        }
//                        catch (Exception ex)
//                        {
//                            // Log and continue — do not break the application flow if attachment read fails
//                            Console.WriteLine("Failed to attach resume: " + ex.Message);
//                        }
//                    }

//                    var message = new EmailMessageDto
//                    {
//                        ToEmail = job.Provider.Email,
//                        ToName = job.Provider?.Name ?? string.Empty,
//                        Subject = $"New applicant for '{job.Title}'",
//                        HtmlBody = html,
//                        PlainTextBody = null,
//                        Attachments = attachment != null ? new List<EmailAttachmentDto> { attachment } : null
//                    };

//                    // Best-effort: do not throw on failure
//                    await _emailService.SendAsync(message);
//                }
//            }
//            catch (Exception ex)
//            {
//                // Log and swallow. Email sending must not break the apply flow.
//                Console.WriteLine("Error sending application email: " + ex.Message);
//            }
//        }

//        // rest of ApplicationService (unchanged)...
//        // other methods from your existing class below...
//        // 🔹 GET MY APPLICATIONS
//        public async Task<IEnumerable<MyApplicationDto>> GetMyApplicationsAsync(int seekerId)
//        {
//            var apps = await _jobRepository.GetApplicationsBySeekerIdAsync(seekerId);

//            return apps.Select(a => new MyApplicationDto
//            {
//                Id = a.Id,
//                JobId = a.JobId,
//                JobTitle = a.Job.Title,
//                Location = a.Job.Location,
//                Status = a.Status,
//                AppliedAt = a.AppliedAt,
//                ResumeUrl = a.ResumeUrl,
//                CoverLetter = a.CoverLetter
//            });
//        }

//        private bool IsValidTransition(string currentStatus, string newStatus)
//        {
//            return currentStatus switch
//            {
//                "Applied" => newStatus == "Approved" || newStatus == "Rejected",
//                "Approved" => false,
//                "Rejected" => false,
//                _ => false
//            };
//        }

//        public async Task UpdateApplicationStatusAsync(int applicationId, string newStatus, int providerId)
//        {
//            var app = await _jobRepository.GetApplicationByIdAsync(applicationId);

//            if (app == null || app.Job.ProviderId != providerId)
//                throw new UnauthorizedAccessException("You are not allowed to update this application");

//            if (!IsValidTransition(app.Status, newStatus))
//                throw new InvalidOperationException($"Invalid status transition: {app.Status} → {newStatus}");

//            await _jobRepository.UpdateApplicationStatusAsync(applicationId, newStatus);

//            var message = newStatus == "Approved"
//                ? $"Your application for '{app.Job.Title}' has been approved 🎉"
//                : newStatus == "Rejected"
//                ? $"Your application for '{app.Job.Title}' was rejected"
//                : $"Your application status for '{app.Job.Title}' is now {newStatus}";

//            await _notificationService.CreateAsync(new CreateNotificationDto
//            {
//                UserId = app.SeekerId,
//                Message = message
//            });
//        }

//        public async Task<(List<ApplicationProviderDto> applications, int total)> GetPagedApplicationsForProviderAsync(int providerId, int page, int pageSize)
//        {
//            var result = await _jobRepository.GetPagedApplicationsByProviderIdAsync(providerId, page, pageSize);

//            var apps = result.applications;
//            var total = result.total;

//            var mapped = apps.Select(a => new ApplicationProviderDto
//            {
//                Id = a.Id,
//                SeekerEmail = a.Seeker?.Email,
//                JobTitle = a.Job?.Title,
//                Status = a.Status,
//                AppliedAt = a.AppliedAt,
//                ResumeUrl = a.ResumeUrl,
//                CoverLetter = a.CoverLetter
//            }).ToList();

//            return (mapped, total);
//        }

//        public async Task<(List<ApplicationProviderDto> applications, int total)> GetPagedApplicationsForSeekerAsync(int seekerId, int page, int pageSize)
//        {
//            var (apps, total) = await _jobRepository.GetPagedApplicationsBySeekerIdAsync(seekerId, page, pageSize);

//            var result = apps.Select(a => new ApplicationProviderDto
//            {
//                Id = a.Id,
//                SeekerEmail = a.Seeker?.Email,
//                JobTitle = a.Job?.Title,
//                Status = a.Status,
//                AppliedAt = a.AppliedAt,
//                ResumeUrl = a.ResumeUrl,
//                CoverLetter = a.CoverLetter
//            }).ToList();

//            return (result, total);
//        }

//        public async Task<bool> HasUserApplied(int jobId, int userId)
//        {
//            return await _jobRepository.HasUserApplied(jobId, userId);
//        }


//        // (keep other methods unchanged)
//        // Helper: safe notification create
//        private async Task _notification_service_safe_create(int userId, string message)
//        {
//            try
//            {
//                await _notificationService.CreateAsync(new CreateNotificationDto
//                {
//                    UserId = userId,
//                    Message = message
//                });
//            }
//            catch
//            {
//                // swallow - do not fail flow due to notification
//            }
//        }

//        // ... rest of class unchanged (update methods kept as-is)
//    }
//}

using JobPortal.Application.Interfaces;
using JobPortal.Application.DTOs;
using JobPortal.Domain.Entities;
using ApplicationEntity = JobPortal.Domain.Entities.Application;
using JobPortal.Application.Exceptions;
using JobPortal.Application.DTOs.Email;
using System.IO;
using Microsoft.Extensions.Logging;

namespace JobPortal.Application.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IJobRepository _jobRepository;
        private readonly IFileService _fileService;
        private readonly INotificationService _notificationService;
        private readonly IUserRepository _userRepository;
        private readonly IEmailService _emailService;
        private readonly IEmailTemplateRenderer _templateRenderer;
        private readonly ILogger<ApplicationService> _logger;

        // ✅ ONLY repository injection (clean architecture)
        public ApplicationService(
            IJobRepository jobRepository,
            IFileService fileService,
            INotificationService notificationService,
            IUserRepository userRepository,
            IEmailService emailService,
            IEmailTemplateRenderer templateRenderer,
            ILogger<ApplicationService> logger)
        {
            _jobRepository = jobRepository;
            _file_service_check(jobRepository, fileService, notificationService, userRepository, emailService, templateRenderer, logger);

            _fileService = fileService;
            _notificationService = notificationService;
            _userRepository = userRepository;
            _emailService = emailService;
            _templateRenderer = templateRenderer;
            _logger = logger;
        }

        // small helper to avoid compiler warning about long constructor; keeps assignments centralized
        private void _file_service_check(
            IJobRepository jobRepository,
            IFileService fileService,
            INotificationService notificationService,
            IUserRepository userRepository,
            IEmailService emailService,
            IEmailTemplateRenderer templateRenderer,
            ILogger<ApplicationService> logger)
        {
            // no-op; method exists only to keep constructor assignments consistent in one place
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
            if (job == null)
            {
                _logger.LogWarning("Job not found after applying. jobId={JobId}, seekerId={SeekerId}", jobId, seekerId);
                return;
            }

            var seeker = await _userRepository.GetUserByIdAsync(seekerId);

            // fetch provider explicitly (navigation may not be loaded)
            var provider = await _user_repository_safe_fetch(job.ProviderId);

            // 🔔 NOTIFY SEEKER (self confirmation)
            await _notification_service_safe_create(seekerId, $"You successfully applied to '{job.Title}'");

            // 🔔 NOTIFY PROVIDER
            await _notification_service_safe_create(job.ProviderId, $"A new applicant {seeker.Name} has applied to your job '{job.Title}'");

            // 🔥 SEND JOB APPLICATION EMAIL TO PROVIDER (best-effort)
            try
            {
                if (!string.IsNullOrEmpty(provider?.Email))
                {
                    // Prepare template model
                    var model = new JobApplicationEmailDto
                    {
                        JobId = job.Id,
                        JobTitle = job.Title,
                        SeekerId = seekerId,
                        SeekerName = seeker.Name,
                        SeekerEmail = seeker.Email,
                        ProfileSummary = seeker?.Name, // replace with a proper summary if available
                        CoverLetter = dto.CoverLetter,
                        AppliedAtUtc = application.AppliedAt,
                        ResumeFileName = Path.GetFileName(resumeUrl ?? string.Empty)
                    };

                    // Render HTML
                    var html = await _templateRenderer.RenderHtmlAsync("JobApplicationNotification", model);

                    // Prepare attachment (read file bytes safely)
                    EmailAttachmentDto? attachment = null;
                    if (!string.IsNullOrEmpty(resumeUrl))
                    {
                        try
                        {
                            var fileBytes = await _fileService.GetFileBytesAsync(resumeUrl);
                            attachment = new EmailAttachmentDto
                            {
                                FileName = Path.GetFileName(resumeUrl),
                                ContentType = "application/pdf",
                                Content = fileBytes
                            };
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning(ex, "Failed to read resume for attachment. resumeUrl={ResumeUrl}", resumeUrl);
                        }
                    }

                    var message = new EmailMessageDto
                    {
                        ToEmail = provider.Email,
                        ToName = provider?.Name ?? string.Empty,
                        Subject = $"New applicant for '{job.Title}'",
                        HtmlBody = html,
                        PlainTextBody = null,
                        Attachments = attachment != null ? new List<EmailAttachmentDto> { attachment } : null
                    };

                    // Best-effort: do not throw on failure
                    var sent = await _emailService.SendAsync(message);
                    _logger.LogInformation("Application email send result: {Sent} to {ProviderEmail} for jobId={JobId} seekerId={SeekerId}", sent, provider.Email, jobId, seekerId);
                }
                else
                {
                    _logger.LogInformation("Provider has no email configured; skipping application email. providerId={ProviderId} jobId={JobId}", job.ProviderId, jobId);
                }
            }
            catch (Exception ex)
            {
                // Log and swallow. Email sending must not break the apply flow.
                _logger.LogError(ex, "Error sending application email for jobId={JobId} seekerId={SeekerId}", jobId, seekerId);
            }
        }

        // rest of ApplicationService (unchanged)...
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

        // Add missing interface methods (if not already present) below...
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

            if (!IsValidTransition(app.Status, newStatus))
                throw new InvalidOperationException($"Invalid status transition: {app.Status} → {newStatus}");

            await _jobRepository.UpdateApplicationStatusAsync(applicationId, newStatus);

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

        public async Task<(List<ApplicationProviderDto> applications, int total)> GetPagedApplicationsForProviderAsync(int providerId, int page, int pageSize)
        {
            var result = await _jobRepository.GetPagedApplicationsByProviderIdAsync(providerId, page, pageSize);

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

        public async Task<(List<ApplicationProviderDto> applications, int total)> GetPagedApplicationsForSeekerAsync(int seekerId, int page, int pageSize)
        {
            var (apps, total) = await _job_repository_get_paged_by_seeker(seekerId, page, pageSize);

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

        private async Task<(List<ApplicationEntity> apps, int total)> _job_repository_get_paged_by_seeker(int seekerId, int page, int pageSize)
        {
            return await _jobRepository.GetPagedApplicationsBySeekerIdAsync(seekerId, page, pageSize);
        }

        public async Task<bool> HasUserApplied(int jobId, int userId)
        {
            return await _jobRepository.HasUserApplied(jobId, userId);
        }

        // helper methods
        private async Task<User?> _user_repository_safe_fetch(int userId)
        {
            try
            {
                return await _userRepository.GetUserByIdAsync(userId);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to fetch user from IUserRepository. userId={UserId}", userId);
                return null;
            }
        }

        private async Task _notification_service_safe_create(int userId, string message)
        {
            try
            {
                await _notificationService.CreateAsync(new CreateNotificationDto
                {
                    UserId = userId,
                    Message = message
                });
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to create notification for userId={UserId}", userId);
            }
        }
    }
}