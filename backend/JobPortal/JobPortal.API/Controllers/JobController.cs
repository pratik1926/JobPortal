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
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            await _jobService.CreateJobAsync(dto, int.Parse(userId));

            return Ok(new { message = "Job Created Successfully" });
        }

        // 🔹 APPLY TO JOB (SEEKER)
        [HttpPost("apply/{jobId}")]
        [Authorize(Roles = "Seeker")]
        public async Task<IActionResult> ApplyToJob(int jobId)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (userId == null)
                    return Unauthorized();

                await _applicationService.ApplyToJobAsync(jobId, int.Parse(userId));

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
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (userId == null)
                    return Unauthorized();

                var applications = await _applicationService.GetMyApplicationsAsync(int.Parse(userId));

                var result = applications.Select(a => new ApplicationResponseDto
                {
                    Id = a.Id,
                    Status = a.Status,
                    AppliedAt = a.AppliedAt,
                    JobTitle = a.Job.Title,
                    Budget = a.Job.Budget,
                    Location = a.Job.Location
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
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (userId == null)
                    return Unauthorized();

                var applications = await _applicationService
                    .GetApplicationsForProviderAsync(int.Parse(userId));

                var result = applications.Select(a => new ApplicationProviderDto
                {
                    Id = a.Id,
                    SeekerEmail = a.Seeker.Email,
                    JobTitle = a.Job.Title,
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

        // 🔥 UPDATE APPLICATION STATUS (PROVIDER - WITH OWNERSHIP VALIDATION)
        [HttpPut("applications/{applicationId}/status")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> UpdateApplicationStatus(int applicationId, [FromBody] string status)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            try
            {
                await _applicationService.UpdateApplicationStatusAsync(
                    applicationId,
                    status,
                    int.Parse(userId)
                );

                return Ok(new { message = "Application status updated successfully" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message); // 🔥 correct
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}