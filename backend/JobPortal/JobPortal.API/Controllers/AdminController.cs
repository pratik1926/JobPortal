using JobPortal.API.Hubs;
using JobPortal.Application.Interfaces;
using JobPortal.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace JobPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] // 🔥 CRITICAL
    public class AdminController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IJobService _jobService;
        private readonly IAdminService _adminService;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly IProviderRestrictionService _restrictionService;
        public AdminController(IUserService userService,
            IJobService jobService,
            IAdminService adminService,
            IHubContext<NotificationHub> hubContext,
            IProviderRestrictionService restrictionService)

        {

            _userService = userService;
            _jobService = jobService;
            _adminService = adminService;
            _hubContext = hubContext;
            _restrictionService = restrictionService;
        }

       

        // ✅ GET PAGINATED USERS
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers(int page = 1, int pageSize = 10)
        {
            pageSize = Math.Min(pageSize, 50);

            var (users, total) = await _userService.GetPagedUsersAsync(page, pageSize);

            return Ok(new
            {
                data = users,
                total,
                page,
                pageSize
            });
        }

        

        // 🔥 BAN USER
        [HttpPut("ban/{id}")]
        public async Task<IActionResult> BanUser(int id)
        {
            var result = await _userService.BanUserAsync(id);

            if (!result)
                return NotFound(new { message = "User not found" });

            await _hubContext.Clients.All.SendAsync("ReceiveAdminUpdate");

            return Ok(new { message = "User banned successfully" });
        }

       

        // 🔥 DELETE USER
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _userService.DeleteUserAsync(id);

            if (!result)
                return NotFound(new { message = "User not found" });

            return Ok(new { message = "User deleted successfully" });
        }


        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllJobsForAdmin(int page = 1, int pageSize = 10)
{
    pageSize = Math.Min(pageSize, 50);

    var (jobs, total) = await _jobService.GetPagedJobsForAdminAsync(page, pageSize);

    return Ok(new
    {
        data = jobs,
        total,
        page,
        pageSize
    });
}



        // 🔥 UNBAN USER
        [HttpPut("unban/{id}")]
        public async Task<IActionResult> UnbanUser(int id)
        {
            var result = await _userService.UnbanUserAsync(id);

            if (!result)
                return NotFound(new { message = "User not found" });

            await _hubContext.Clients.All.SendAsync("ReceiveAdminUpdate");

            return Ok(new { message = "User unbanned successfully" });
        }

        [HttpGet("analytics")]
        public async Task<IActionResult> GetAnalytics()
        {
            var data = await _adminService.GetAnalyticsAsync();
            return Ok(data);
        }

        // New endpoint
        [HttpPost("reports/{reportId}/restrict")]
        public async Task<IActionResult> RestrictSeekerByReport(int reportId)
        {
            var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _restrictionService.CreateFromReportAsync(reportId, adminId);

            return Ok(new { data = result, message = "Provider restriction created (or already existed)." });
        }

        [HttpGet("export-system-report")]
        public async Task<IActionResult>
ExportJobs()
        {
            var fileBytes =
                await _adminService
                .ExportSystemReportAsync();

            return File(
                fileBytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "system-report.xlsx"
            );
        }

        [HttpGet("export/jobs")]
        public async Task<IActionResult>
ExportJobsReport()
        {
            var fileBytes =
                await _adminService
                    .ExportJobsReportAsync();

            return File(
                fileBytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "jobs-report.xlsx");
        }

        [HttpGet("export/users")]
        public async Task<IActionResult>
ExportUsersReport()
        {
            var fileBytes =
                await _adminService
                    .ExportUsersReportAsync();

            return File(
                fileBytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "users-report.xlsx");
        }

        [HttpGet("export/moderation")]
        public async Task<IActionResult>
ExportModerationReport()
        {
            var fileBytes =
                await _adminService
                    .ExportModerationReportAsync();

            return File(
                fileBytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "moderation-report.xlsx");
        }

        [HttpGet("export/categories")]
        public async Task<IActionResult>
ExportCategoriesReport()
        {
            var fileBytes =
                await _adminService
                    .ExportReportCategoriesAsync();

            return File(
                fileBytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "report-categories.xlsx");
        }

        [HttpGet("export/timeline")]
        public async Task<IActionResult>
ExportTimelineReport()
        {
            var fileBytes =
                await _adminService
                    .ExportReportsTimelineAsync();

            return File(
                fileBytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "reports-timeline.xlsx");
        }

        [HttpGet("jobs-report-preview")]
        public async Task<IActionResult>GetJobsReportPreview()
        {
            var data =
                await _adminService
                .GetJobsReportPreviewAsync();

            return Ok(data);
        }
    }
}