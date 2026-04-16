using JobPortal.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using JobPortal.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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

        // 🔥 ROBUST USER ID EXTRACTOR (FINAL FIX)
        private int? GetUserId()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c =>
                c.Type == ClaimTypes.NameIdentifier ||
                c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier" ||
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

        // 🔹 CREATE JOB (PROVIDER)
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

        // 🔹 APPLY TO JOB (SEEKER)
        [HttpPost("apply/{jobId}")]
        [Authorize(Roles = "Seeker")]
        public async Task<IActionResult> ApplyToJob(int jobId)
        {
            try
            {
                var userId = GetUserId();

                if (userId == null)
                    return Unauthorized("Invalid user token");

                await _applicationService.ApplyToJobAsync(jobId, userId.Value);

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
            try
            {
                var userId = GetUserId();
                Console.WriteLine($"User Id from token: {GetUserId()}");

                if (userId == null)
                    return Unauthorized("Invalid user token");

                var applications = await _applicationService.GetMyApplicationsAsync(userId.Value);

                var result = applications.Select(a => new ApplicationResponseDto
                {
                    Id = a.Id,
                    Status = a.Status,
                    AppliedAt = a.AppliedAt,
                    JobTitle = a.Job?.Title ?? "",
                    Budget = a.Job?.Budget ?? 0,
                    Location = a.Job?.Location ?? ""
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // 🔹 GET APPLICATIONS FOR PROVIDER
        [HttpGet("applications")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> GetApplicationsForMyJobs()
        {
            try
            {
                var userId = GetUserId();

                if (userId == null)
                    return Unauthorized("Invalid user token");

                var applications = await _applicationService
                    .GetApplicationsForProviderAsync(userId.Value);

                var result = applications.Select(a => new ApplicationProviderDto
                {
                    Id = a.Id,
                    SeekerEmail = a.Seeker?.Email ?? "",
                    JobTitle = a.Job?.Title ?? "",
                    Status = a.Status,
                    AppliedAt = a.AppliedAt
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // 🔥 UPDATE APPLICATION STATUS
        [HttpPut("applications/{applicationId}/status")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> UpdateApplicationStatus(int applicationId, [FromBody] string status)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized("Invalid user token");

            try
            {
                await _applicationService.UpdateApplicationStatusAsync(
                    applicationId,
                    status,
                    userId.Value
                );

                return Ok(new { message = "Application status updated successfully" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}