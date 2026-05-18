using JobPortal.Domain.Entities;
using JobPortal.Application.DTOs.Reports;
using JobPortal.Application.Interfaces.Jobs;
using JobPortal.Application.Interfaces.Reports;
using JobPortal.Application.Interfaces.Users;

namespace JobPortal.Application.Services
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _reportRepository;
        private readonly IJobRepository _jobRepository;
        private readonly IUserRepository _userRepository;
        private readonly INotificationService _notificationService;

        

        public ReportService(
            IReportRepository reportRepository,
            IJobRepository jobRepository,
            IUserRepository userRepository,
            INotificationService notificationService)
        {
            _reportRepository = reportRepository;
            _jobRepository = jobRepository;
            _userRepository = userRepository;
            _notificationService = notificationService;
        }

        public async Task<ReportDto> CreateReportAsync(int reporterId, CreateReportDto dto)
        {
            // Validate application exists
            var application = await _jobRepository.GetApplicationByIdAsync(dto.ApplicationId);
            if (application == null)
                throw new ArgumentException("Application not found");

            // Provider must own the job of the application
            if (application.Job == null || application.Job.ProviderId != reporterId)
                throw new UnauthorizedAccessException("You can only report users who applied to your job");

            // Only approved applications can be reported
            if (!string.Equals(application.Status, "Approved", StringComparison.OrdinalIgnoreCase))
                throw new InvalidOperationException("Only approved applications can be reported");

            // Prevent duplicate report for same application by same reporter
            var exists = await _reportRepository.ReportExistsForApplicationByReporterAsync(dto.ApplicationId, reporterId);
            if (exists)
                throw new InvalidOperationException("You have already reported this application");

            // Fetch reported user and reporter names
            var reportedUser = await _userRepository.GetUserByIdAsync(application.SeekerId);
            var reporter = await _userRepository.GetUserByIdAsync(reporterId);

            var report = new Report
            {
                ReporterId = reporterId,
                ReportedUserId = application.SeekerId,
                ApplicationId = dto.ApplicationId,
                Reason = dto.Reason,
                Details = dto.Details,
                CreatedAt = DateTime.UtcNow,
                Status = "Pending",
                IsResolved = false
            };

            var created = await _reportRepository.CreateReportAsync(report);

            // Notify admin
            //await _notification_service_safe_create(AdminUserId, $"New report submitted by {reporter?.Name ?? reporterId.ToString()} against {reportedUser?.Name ?? application.SeekerId.ToString()} for job '{application.Job?.Title}'");
            var admins = await _userRepository.GetAdminsAsync();

            foreach (var admin in admins)
            {
                await _notification_service_safe_create(
                    admin.Id,
                    $"New report submitted by {reporter?.Name ?? reporterId.ToString()} against {reportedUser?.Name ?? application.SeekerId.ToString()} for job '{application.Job?.Title}'"
                );
            }

            // Map to DTO
            var mapped = new ReportDto
            {
                Id = created.Id,
                ReporterId = created.ReporterId,
                ReporterName = reporter?.Name ?? string.Empty,
                ReportedUserId = created.ReportedUserId,
                ReportedUserName = reportedUser?.Name ?? string.Empty,
                ApplicationId = created.ApplicationId,
                JobId = application.JobId,
                JobTitle = application.Job?.Title ?? string.Empty,
                Reason = created.Reason,
                Details = created.Details,
                Status = created.Status,
                CreatedAt = created.CreatedAt
            };

            return mapped;
        }

        public async Task<IEnumerable<ReportDto>> GetReportsByReporterAsync(int reporterId)
        {
            var reports = await _reportRepository.GetReportsByReporterIdAsync(reporterId);
            var list = reports.Select(r => new ReportDto
            {
                Id = r.Id,
                ReporterId = r.ReporterId,
                ReporterName = r.Reporter?.Name ?? string.Empty,
                ReportedUserId = r.ReportedUserId,
                ReportedUserName = r.ReportedUser?.Name ?? string.Empty,
                ApplicationId = r.ApplicationId,
                JobId = r.Application?.JobId ?? 0,
                JobTitle = r.Application?.Job?.Title ?? string.Empty,
                Reason = r.Reason,
                Details = r.Details,
                Status = r.Status,
                CreatedAt = r.CreatedAt
            }).ToList();

            return list;
        }

        public async Task<IEnumerable<ReportDto>> GetAllReportsForAdminAsync()
        {
            var reports = await _reportRepository.GetAllReportsAsync();
            var list = reports.Select(r => new ReportDto
            {
                Id = r.Id,
                ReporterId = r.ReporterId,
                ReporterName = r.Reporter?.Name ?? string.Empty,
                ReportedUserId = r.ReportedUserId,
                ReportedUserName = r.ReportedUser?.Name ?? string.Empty,
                ApplicationId = r.ApplicationId,
                JobId = r.Application?.JobId ?? 0,
                JobTitle = r.Application?.Job?.Title ?? string.Empty,
                Reason = r.Reason,
                Details = r.Details,
                Status = r.Status,
                CreatedAt = r.CreatedAt
            }).ToList();

            return list;
        }

        public async Task<ReportDto?> GetReportByIdAsync(int id)
        {
            var r = await _reportRepository.GetReportByIdAsync(id);
            if (r == null) return null;

            return new ReportDto
            {
                Id = r.Id,
                ReporterId = r.ReporterId,
                ReporterName = r.Reporter?.Name ?? string.Empty,
                ReportedUserId = r.ReportedUserId,
                ReportedUserName = r.ReportedUser?.Name ?? string.Empty,
                ApplicationId = r.ApplicationId,
                JobId = r.Application?.JobId ?? 0,
                JobTitle = r.Application?.Job?.Title ?? string.Empty,
                Reason = r.Reason,
                Details = r.Details,
                Status = r.Status,
                CreatedAt = r.CreatedAt
            };
        }

        // Helper: ensure notification creation does not break flow
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
            catch
            {
                // swallow - do not fail report creation due to notification issues
            }
        }

        public async Task<bool> ReviewReportAsync(int reportId, int adminId, UpdateReportStatusDto dto)
        {
            var report = await _reportRepository.GetReportByIdAsync(reportId);
            if (report == null) throw new ArgumentException("Report not found");
            if (report.IsResolved) throw new InvalidOperationException("Report already resolved");

            report.Status = "Reviewed";
            report.AdminNotes = dto.AdminNotes;
            report.ReviewedAt = DateTime.UtcNow;
            report.ReviewedByAdminId = adminId;

            return await _reportRepository.UpdateReportAsync(report);
        }

        public async Task<bool> RejectReportAsync(int reportId, int adminId, UpdateReportStatusDto dto)
        {
            var report = await _reportRepository.GetReportByIdAsync(reportId);
            if (report == null) throw new ArgumentException("Report not found");
            if (report.IsResolved) throw new InvalidOperationException("Report already resolved");

            report.Status = "Rejected";
            report.AdminNotes = dto.AdminNotes;
            report.ReviewedAt = DateTime.UtcNow;
            report.ReviewedByAdminId = adminId;
            report.IsResolved = true;

            return await _reportRepository.UpdateReportAsync(report);
        }

        public async Task<bool> ResolveReportAsync(int reportId, int adminId, UpdateReportStatusDto dto)
        {
            var report = await _reportRepository.GetReportByIdAsync(reportId);
            if (report == null) throw new ArgumentException("Report not found");
            if (report.IsResolved) throw new InvalidOperationException("Report already resolved");

            report.Status = "ActionTaken";
            report.AdminNotes = dto.AdminNotes;
            report.ReviewedAt = DateTime.UtcNow;
            report.ReviewedByAdminId = adminId;
            report.IsResolved = true;

            return await _reportRepository.UpdateReportAsync(report);
        }
    }
}