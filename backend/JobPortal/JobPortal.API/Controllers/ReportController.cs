using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using JobPortal.Application.Interfaces;
using JobPortal.Application.DTOs;

namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportController(IReportService reportService)
        {
            _reportService = reportService;
        }

        private int? GetUserId()
        {
            var claim = User.Claims.FirstOrDefault(c =>
                c.Type == ClaimTypes.NameIdentifier ||
                c.Type.Contains("nameidentifier"));

            return int.TryParse(claim?.Value, out int id) ? id : null;
        }

        // Provider creates a report — only when the related application is Approved and belongs to provider
        [HttpPost]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> CreateReport([FromBody] CreateReportDto dto)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var result = await _reportService.CreateReportAsync(userId.Value, dto);
            return Ok(new { message = "Report submitted", data = result });
        }

        // Provider gets their submitted reports
        [HttpGet("my")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> GetMyReports()
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var reports = await _reportService.GetReportsByReporterAsync(userId.Value);
            return Ok(reports);
        }

        // Admin: get all reports
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllReports()
        {
            var reports = await _reportService.GetAllReportsForAdminAsync();
            return Ok(reports);
        }

        [HttpPatch("{id}/review")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ReviewReport(int id, [FromBody] UpdateReportStatusDto dto)
        {
            var adminId = GetUserId();
            if (adminId == null) return Unauthorized();
            await _reportService.ReviewReportAsync(id, adminId.Value, dto);
            return Ok(new { message = "Report reviewed" });
        }

        [HttpPatch("{id}/reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RejectReport(int id, [FromBody] UpdateReportStatusDto dto)
        {
            var adminId = GetUserId();
            if (adminId == null) return Unauthorized();
            await _reportService.RejectReportAsync(id, adminId.Value, dto);
            return Ok(new { message = "Report rejected" });
        }

        [HttpPatch("{id}/resolve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ResolveReport(int id, [FromBody] UpdateReportStatusDto dto)
        {
            var adminId = GetUserId();
            if (adminId == null) return Unauthorized();
            await _reportService.ResolveReportAsync(id, adminId.Value, dto);
            return Ok(new { message = "Report resolved" });
        }
    }
}