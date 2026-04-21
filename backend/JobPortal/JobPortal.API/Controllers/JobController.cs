using JobPortal.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using JobPortal.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using JobPortal.API.DTOs;
using Microsoft.EntityFrameworkCore;
using JobPortal.Application.DTOs;
using JobPortal.Infrastructure.Repositories;
namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobController : ControllerBase
    {
        private readonly IJobService _jobService;
        private readonly IApplicationService _applicationService;
        private readonly IFileService _fileService;
        private readonly IJobRepository _jobRepository;

        public JobController(
            IJobService jobService,
            IApplicationService applicationService,
            IFileService fileService,             IJobRepository jobRepository)
        {
            _jobService = jobService;
            _applicationService = applicationService;
            _fileService = fileService;
            _jobRepository = jobRepository;
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

        // 🔥 APPLY TO JOB (FINAL CLEAN VERSION)
        [HttpPost("apply/{jobId}")]
        [Authorize(Roles = "Seeker")]
        public async Task<IActionResult> ApplyToJob(int jobId, [FromForm] ApplyJobRequest request)
        {
            try
            {
                var userId = GetUserId();

                if (userId == null)
                    return Unauthorized("Invalid user token");
                // 🔥 PREVENT DUPLICATE APPLY
                var alreadyApplied = await _applicationService.HasUserApplied(jobId, userId.Value);

                if (alreadyApplied)
                {
                    return BadRequest("You already applied to this job");
                }

                var resume = request.Resume;
                var coverLetter = request.CoverLetter;

                // ✅ VALIDATION
                if (resume == null || resume.Length == 0)
                    return BadRequest("Resume is required");

                var extension = Path.GetExtension(resume.FileName).ToLower();

                if (extension != ".pdf")
                    return BadRequest("Only PDF files are allowed");

                // 🔥 CONVERT FILE → BYTE ARRAY
                byte[] fileBytes;
                using (var ms = new MemoryStream())
                {
                    await resume.CopyToAsync(ms);
                    fileBytes = ms.ToArray();
                }

                // 🔥 SAVE USING FILE SERVICE
                var resumeUrl = await _fileService.SaveResumeAsync(fileBytes, resume.FileName);

                // 🔥 CLEAN DTO (Application Layer)
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

        [HttpGet("my-jobs")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> GetMyJobs()
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized("User ID not found");

            var jobs = await _jobService.GetJobsByProviderId(userId.Value);

            return Ok(jobs);
        }


        // 🔹 GET MY APPLICATIONS
        [HttpGet("my-applications")]
        [Authorize(Roles = "Seeker")]
        public async Task<IActionResult> GetMyApplications()
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            var applications = await _applicationService.GetMyApplicationsAsync(userId.Value);

            return Ok(applications);
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

        //// 🔥 UPDATE STATUS
        //[HttpPut("applications/{applicationId}/status")]
        //[Authorize(Roles = "Provider")]
        //public async Task<IActionResult> UpdateApplicationStatus(int applicationId, [FromBody] string status)
        //{
        //    var userId = GetUserId();

        //    if (userId == null)
        //        return Unauthorized();

        //    await _applicationService.UpdateApplicationStatusAsync(applicationId, status, userId.Value);

        //    return Ok(new { message = "Application status updated successfully" });
        //}

        [HttpPut("applications/{applicationId}/status")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> UpdateApplicationStatus(
    int applicationId,
    [FromBody] UpdateStatusDto dto)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            await _applicationService.UpdateApplicationStatusAsync(
                applicationId,
                dto.Status,
                userId.Value
            );

            return Ok(new { message = "Application status updated successfully" });
        }


        [Authorize(Roles = "Provider")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(int id, UpdateJobDto dto)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
                return Unauthorized("User ID not found in token");

            var userId = int.Parse(userIdClaim.Value);

            var job = await _jobRepository.GetJobByIdAsync(id);

            if (job == null)
                return NotFound("Job not found");

            // 🔥 IMPORTANT: ownership check
            if (job.ProviderId != userId)
                return Forbid("You can only edit your own jobs");

            job.Title = dto.Title;
            job.Description = dto.Description;
            job.Budget = dto.Budget;
            job.Location = dto.Location;
            job.Skills = dto.Skills;

            await _jobRepository.UpdateJobAsync(job);

            return Ok(job);
        }

        [Authorize(Roles = "Provider")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized("User not found");

            var job = await _jobRepository.GetJobByIdAsync(id);

            if (job == null)
                return NotFound("Job not found");

            // 🔒 ownership check
            if (job.ProviderId != userId.Value)
                return Forbid("You can only delete your own jobs");

            await _jobRepository.DeleteJobAsync(id);

            return Ok(new { message = "Job deleted successfully" });
        }
    }
}