using JobPortal.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using JobPortal.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using JobPortal.API.DTOs;

namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobController : ControllerBase
    {
        private readonly IJobService _jobService;
        private readonly IApplicationService _applicationService;

        public JobController(IJobService jobService, IApplicationService applicationService)
        {
            _jobService = jobService;
            _applicationService = applicationService;
        }

        // 🔥 USER ID EXTRACTOR
        private int? GetUserId()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c =>
                c.Type == ClaimTypes.NameIdentifier ||
                c.Type.Contains("nameidentifier")
            );

            if (userIdClaim == null)
                return null;

            if (int.TryParse(userIdClaim.Value, out int userId))
                return userId;

            return null;
        }

        // 🔹 GET ALL JOBS
        [HttpGet]
        public async Task<IActionResult> GetJobs()
        {
            var jobs = await _jobService.GetAllJobsAsync();
            return Ok(jobs);
        }

        // 🔹 CREATE JOB
        [HttpPost]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> CreateJob(CreateJobDto dto)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized("Invalid user token");

            await _jobService.CreateJobAsync(dto, userId.Value);

            return Ok(new { message = "Job Created Successfully" });
        }

        // 🔥 APPLY TO JOB (FIXED)
        [HttpPost("apply/{jobId}")]
        [Authorize(Roles = "Seeker")]
        public async Task<IActionResult> ApplyToJob(int jobId, [FromForm] ApplyJobRequest request)
        {
            try
            {
                var userId = GetUserId();

                if (userId == null)
                    return Unauthorized("Invalid user token");

                var resume = request.Resume;
                var coverLetter = request.CoverLetter;

                // ✅ VALIDATION
                if (resume == null || resume.Length == 0)
                    return BadRequest("Resume is required");

                var allowedExtensions = new[] { ".pdf" };
                var extension = Path.GetExtension(resume.FileName).ToLower();

                if (!allowedExtensions.Contains(extension))
                    return BadRequest("Only PDF files are allowed");

                // ✅ SAVE FILE
                var fileName = Guid.NewGuid() + extension;
                var folderPath = Path.Combine("wwwroot", "resumes");

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                var filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await resume.CopyToAsync(stream);
                }

                var resumeUrl = $"/resumes/{fileName}";

                // ✅ CLEAN DTO
                var dto = new ApplyJobDto
                {
                    ResumeUrl = resumeUrl,
                    CoverLetter = coverLetter
                };

                await _applicationService.ApplyToJobAsync(jobId, userId.Value, dto);

                return Ok(new { message = "Applied successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // 🔹 GET MY APPLICATIONS (SEEKER)
        [HttpGet("my-applications")]
        [Authorize(Roles = "Seeker")]
        public async Task<IActionResult> GetMyApplications()
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            var applications = await _applicationService.GetMyApplicationsAsync(userId.Value);

            var result = applications.Select(a => new ApplicationProviderDto
            {
                Id = a.Id,
                SeekerEmail = a.Seeker?.Email ?? "",
                JobTitle = a.Job?.Title ?? "",
                Status = a.Status,
                AppliedAt = a.AppliedAt,
                ResumeUrl = a.ResumeUrl,
                CoverLetter = a.CoverLetter
            });

            return Ok(result);
        }

        // 🔹 GET APPLICATIONS FOR PROVIDER
        [HttpGet("applications")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> GetApplicationsForMyJobs()
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            var applications = await _applicationService.GetApplicationsForProviderAsync(userId.Value);

            var result = applications.Select(a => new ApplicationProviderDto
            {
                Id = a.Id,
                SeekerEmail = a.Seeker?.Email ?? "",
                JobTitle = a.Job?.Title ?? "",
                Status = a.Status,
                AppliedAt = a.AppliedAt,
                ResumeUrl = a.ResumeUrl,
                CoverLetter = a.CoverLetter
            });

            return Ok(result);
        }

        // 🔥 UPDATE STATUS
        [HttpPut("applications/{applicationId}/status")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> UpdateApplicationStatus(int applicationId, [FromBody] string status)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            await _applicationService.UpdateApplicationStatusAsync(applicationId, status, userId.Value);

            return Ok(new { message = "Application status updated successfully" });
        }
    }
}