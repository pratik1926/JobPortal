using JobPortal.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using JobPortal.Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using JobPortal.API.DTOs;
using Microsoft.EntityFrameworkCore;
namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobController : ControllerBase
    {
        private readonly IJobService _jobService;
        private readonly IApplicationService _applicationService;
        
        private readonly IUserService _userService;

        public JobController(
            IJobService jobService,
            IApplicationService applicationService,
            
            IUserService userService)
        {
            _jobService = jobService;
            _applicationService = applicationService;
           
            _userService = userService;
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


        //[HttpPost("apply/{jobId}")]
        //[Authorize(Roles = "Seeker")]
        //public async Task<IActionResult> ApplyToJob(int jobId, [FromForm] ApplyJobRequest request)
        //{

        //        var userId = GetUserId();

        //        if (userId == null)
        //            throw new UnauthorizedAccessException("Invalid user token");

        //        if (request.Resume == null || request.Resume.Length == 0)
        //            throw new ArgumentException("Resume is required");

        //        // 🔥 Convert IFormFile → byte[]
        //        using var ms = new MemoryStream();
        //        await request.Resume.CopyToAsync(ms);

        //        var dto = new ApplyJobDto
        //        {
        //            Resume = ms.ToArray(),
        //            FileName = request.Resume.FileName,
        //            CoverLetter = request.CoverLetter
        //        };

        //        // ✅ Pass DTO (NOT request)
        //        await _applicationService.ApplyToJobAsync(jobId, userId.Value, dto);

        //    var job = await _jobService.GetJobByIdAsync(jobId);
        //    // 🔥 CREATE NOTIFICATION
        //    await _notificationService.CreateAsync(new CreateNotificationDto
        //        {
        //            UserId = userId.Value,
        //            Message = $"You applied for '{job.Title}'"
        //        });

        //        // 🔥 GET JOB DETAILS

        //        // 🔥 NOTIFY PROVIDER
        //        await _notificationService.CreateAsync(new CreateNotificationDto
        //        {
        //            UserId = job.ProviderId,
        //            Message = $"New applicant for your job '{job.Title}'"
        //        });

        //    return Ok(new { message = "Applied successfully" });

        //}

        [HttpPost("apply/{jobId}")]
        [Authorize(Roles = "Seeker")]
        public async Task<IActionResult> ApplyToJob(int jobId, [FromForm] ApplyJobRequest request)
        {
            var userId = GetUserId();

            if (userId == null)
                throw new UnauthorizedAccessException("Invalid user token");

            if (request.Resume == null || request.Resume.Length == 0)
                throw new ArgumentException("Resume is required");

            // 🔥 Convert IFormFile → byte[]
            using var ms = new MemoryStream();
            await request.Resume.CopyToAsync(ms);

            var dto = new ApplyJobDto
            {
                Resume = ms.ToArray(),
                FileName = request.Resume.FileName,
                CoverLetter = request.CoverLetter
            };

            // ✅ BUSINESS LOGIC HANDLED IN SERVICE
            await _applicationService.ApplyToJobAsync(jobId, userId.Value, dto);

            return Ok(new { message = "Applied successfully" });
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


        //[Authorize(Roles = "Provider")]
        //[HttpPut("{id}")]
        //public async Task<IActionResult> UpdateJob(int id, UpdateJobDto dto)
        //{
        //    var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);

        //    if (userIdClaim == null)
        //        return Unauthorized("User ID not found in token");

        //    var userId = int.Parse(userIdClaim.Value);

        //    var job = await _jobRepository.GetJobByIdAsync(id);

        //    if (job == null)
        //        return NotFound("Job not found");

        //    // 🔥 IMPORTANT: ownership check
        //    if (job.ProviderId != userId)
        //        return Forbid("You can only edit your own jobs");

        //    job.Title = dto.Title;
        //    job.Description = dto.Description;
        //    job.Budget = dto.Budget;
        //    job.Location = dto.Location;
        //    job.Skills = dto.Skills;

        //    await _jobRepository.UpdateJobAsync(job);

        //    return Ok(job);
        //}

        // 🔥 UPDATE JOB (CLEANED)
        [HttpPut("{id}")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> UpdateJob(int id, UpdateJobDto dto)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized("User ID not found");

            await _jobService.UpdateJobAsync(id, dto, userId.Value);

            return Ok(new { message = "Job updated successfully" });
        }




        //[Authorize(Roles = "Provider")]
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteJob(int id)
        //{
        //    var userId = GetUserId();

        //    if (userId == null)
        //        return Unauthorized("User not found");

        //    var job = await _jobRepository.GetJobByIdAsync(id);

        //    if (job == null)
        //        return NotFound("Job not found");

        //    // 🔒 ownership check
        //    if (job.ProviderId != userId.Value)
        //        return Forbid("You can only delete your own jobs");

        //    await _jobRepository.DeleteJobAsync(id);

        //    return Ok(new { message = "Job deleted successfully" });
        //}

        // 🔥 DELETE JOB (CLEANED)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized("User not found");

            await _jobService.DeleteJobAsync(id, userId.Value);

            return Ok(new { message = "Job deleted successfully" });
        }





    }
}