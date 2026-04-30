//using JobPortal.Application.Interfaces;
//using Microsoft.AspNetCore.Mvc;
//using JobPortal.Application.DTOs;
//using Microsoft.AspNetCore.Authorization;
//using System.Security.Claims;
//using JobPortal.API.DTOs;
//using Microsoft.EntityFrameworkCore;
//namespace JobPortal.API.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class JobController : ControllerBase
//    {
//        private readonly IJobService _jobService;
//        private readonly IApplicationService _applicationService;

//        private readonly IUserService _userService;

//        public JobController(
//            IJobService jobService,
//            IApplicationService applicationService,

//            IUserService userService)
//        {
//            _jobService = jobService;
//            _applicationService = applicationService;

//            _userService = userService;
//        }

//        // 🔥 USER ID EXTRACTOR
//        private int? GetUserId()
//        {
//            var userIdClaim = User.Claims.FirstOrDefault(c =>
//                c.Type == ClaimTypes.NameIdentifier ||
//                c.Type.Contains("nameidentifier")
//            );

//            if (userIdClaim == null)
//                return null;

//            if (int.TryParse(userIdClaim.Value, out int userId))
//                return userId;

//            return null;
//        }

//        // 🔹 GET ALL JOBS
//        [HttpGet]
//        public async Task<IActionResult> GetJobs(int page = 1, int pageSize = 10)
//        {
//            var (jobs, total) = await _jobService.GetPagedJobsAsync(page, pageSize);

//            var result = jobs.Select(j => new JobDto
//            {
//                Id = j.Id,
//                Title = j.Title,
//                Description = j.Description,
//                Budget = j.Budget,
//                Location = j.Location,
//                CreatedAt = j.CreatedAt,
//                Skills = j.Skills,
//                ProviderName = j.Provider?.Name,
//                ProviderEmail = j.Provider?.Email
//            }).ToList();

//            return Ok(new
//            {
//                data = result,
//                total,
//                page,
//                pageSize
//            });
//        }

//        // 🔹 CREATE JOB
//        [HttpPost]
//        [Authorize(Roles = "Provider")]
//        public async Task<IActionResult> CreateJob(CreateJobDto dto)
//        {
//            var userId = GetUserId();

//            if (userId == null)
//                return Unauthorized("Invalid user token");

//            await _jobService.CreateJobAsync(dto, userId.Value);

//            return Ok(new { message = "Job Created Successfully" });
//        }


//        //[HttpPost("apply/{jobId}")]
//        //[Authorize(Roles = "Seeker")]
//        //public async Task<IActionResult> ApplyToJob(int jobId, [FromForm] ApplyJobRequest request)
//        //{

//        //        var userId = GetUserId();

//        //        if (userId == null)
//        //            throw new UnauthorizedAccessException("Invalid user token");

//        //        if (request.Resume == null || request.Resume.Length == 0)
//        //            throw new ArgumentException("Resume is required");

//        //        // 🔥 Convert IFormFile → byte[]
//        //        using var ms = new MemoryStream();
//        //        await request.Resume.CopyToAsync(ms);

//        //        var dto = new ApplyJobDto
//        //        {
//        //            Resume = ms.ToArray(),
//        //            FileName = request.Resume.FileName,
//        //            CoverLetter = request.CoverLetter
//        //        };

//        //        // ✅ Pass DTO (NOT request)
//        //        await _applicationService.ApplyToJobAsync(jobId, userId.Value, dto);

//        //    var job = await _jobService.GetJobByIdAsync(jobId);
//        //    // 🔥 CREATE NOTIFICATION
//        //    await _notificationService.CreateAsync(new CreateNotificationDto
//        //        {
//        //            UserId = userId.Value,
//        //            Message = $"You applied for '{job.Title}'"
//        //        });

//        //        // 🔥 GET JOB DETAILS

//        //        // 🔥 NOTIFY PROVIDER
//        //        await _notificationService.CreateAsync(new CreateNotificationDto
//        //        {
//        //            UserId = job.ProviderId,
//        //            Message = $"New applicant for your job '{job.Title}'"
//        //        });

//        //    return Ok(new { message = "Applied successfully" });

//        //}

//        [HttpPost("apply/{jobId}")]
//        [Authorize(Roles = "Seeker")]
//        public async Task<IActionResult> ApplyToJob(int jobId, [FromForm] ApplyJobRequest request)
//        {
//            var userId = GetUserId();

//            if (userId == null)
//                throw new UnauthorizedAccessException("Invalid user token");

//            if (request.Resume == null || request.Resume.Length == 0)
//                throw new ArgumentException("Resume is required");

//            // 🔥 Convert IFormFile → byte[]
//            using var ms = new MemoryStream();
//            await request.Resume.CopyToAsync(ms);

//            var dto = new ApplyJobDto
//            {
//                Resume = ms.ToArray(),
//                FileName = request.Resume.FileName,
//                CoverLetter = request.CoverLetter
//            };

//            // ✅ BUSINESS LOGIC HANDLED IN SERVICE
//            await _applicationService.ApplyToJobAsync(jobId, userId.Value, dto);

//            return Ok(new { message = "Applied successfully" });
//        }


//        //[HttpGet("my-jobs")]
//        //[Authorize(Roles = "Provider")]
//        //public async Task<IActionResult> GetMyJobs()
//        //{
//        //    var userId = GetUserId();

//        //    if (userId == null)
//        //        return Unauthorized("User ID not found");

//        //    var jobs = await _jobService.GetJobsByProviderId(userId.Value);

//        //    return Ok(jobs);
//        //}

//        [HttpGet("my-jobs")]
//        [Authorize(Roles = "Provider")]
//        public async Task<IActionResult> GetMyJobs()
//        {
//            var userId = GetUserId();

//            if (userId == null)
//                return Unauthorized("User ID not found");

//            var jobs = await _jobService.GetJobsByProviderId(userId.Value);

//            var result = jobs.Select(j => new JobDto
//            {
//                Id = j.Id,
//                Title = j.Title,
//                Description = j.Description,
//                Budget = j.Budget,
//                Location = j.Location,
//                CreatedAt = j.CreatedAt,
//                Skills = j.Skills,
//                ProviderName = j.Provider?.Name,
//                ProviderEmail = j.Provider?.Email
//            }).ToList();

//            return Ok(result);
//        }


//        // 🔹 GET MY APPLICATIONS
//        [HttpGet("my-applications")]
//        [Authorize(Roles = "Seeker")]
//        public async Task<IActionResult> GetMyApplications()
//        {
//            var userId = GetUserId();

//            if (userId == null)
//                return Unauthorized();

//            var applications = await _applicationService.GetMyApplicationsAsync(userId.Value);

//            return Ok(applications);
//        }

//        // 🔹 GET APPLICATIONS FOR PROVIDER
//        [HttpGet("applications")]
//        [Authorize(Roles = "Provider")]
//        public async Task<IActionResult> GetApplicationsForMyJobs()
//        {
//            var userId = GetUserId();

//            if (userId == null)
//                return Unauthorized();

//            var applications = await _applicationService.GetApplicationsForProviderAsync(userId.Value);

//            var result = applications.Select(a => new ApplicationProviderDto
//            {
//                Id = a.Id,
//                SeekerEmail = a.Seeker?.Email ?? "",
//                JobTitle = a.Job?.Title ?? "",
//                Status = a.Status,
//                AppliedAt = a.AppliedAt,
//                ResumeUrl = a.ResumeUrl,
//                CoverLetter = a.CoverLetter
//            });

//            return Ok(result);
//        }

//        //// 🔥 UPDATE STATUS
//        //[HttpPut("applications/{applicationId}/status")]
//        //[Authorize(Roles = "Provider")]
//        //public async Task<IActionResult> UpdateApplicationStatus(int applicationId, [FromBody] string status)
//        //{
//        //    var userId = GetUserId();

//        //    if (userId == null)
//        //        return Unauthorized();

//        //    await _applicationService.UpdateApplicationStatusAsync(applicationId, status, userId.Value);

//        //    return Ok(new { message = "Application status updated successfully" });
//        //}

//        [HttpPut("applications/{applicationId}/status")]
//        [Authorize(Roles = "Provider")]
//        public async Task<IActionResult> UpdateApplicationStatus(
//    int applicationId,
//    [FromBody] UpdateStatusDto dto)
//        {
//            var userId = GetUserId();

//            if (userId == null)
//                return Unauthorized();

//            await _applicationService.UpdateApplicationStatusAsync(
//                applicationId,
//                dto.Status,
//                userId.Value
//            );

//            return Ok(new { message = "Application status updated successfully" });
//        }


//        //[Authorize(Roles = "Provider")]
//        //[HttpPut("{id}")]
//        //public async Task<IActionResult> UpdateJob(int id, UpdateJobDto dto)
//        //{
//        //    var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);

//        //    if (userIdClaim == null)
//        //        return Unauthorized("User ID not found in token");

//        //    var userId = int.Parse(userIdClaim.Value);

//        //    var job = await _jobRepository.GetJobByIdAsync(id);

//        //    if (job == null)
//        //        return NotFound("Job not found");

//        //    // 🔥 IMPORTANT: ownership check
//        //    if (job.ProviderId != userId)
//        //        return Forbid("You can only edit your own jobs");

//        //    job.Title = dto.Title;
//        //    job.Description = dto.Description;
//        //    job.Budget = dto.Budget;
//        //    job.Location = dto.Location;
//        //    job.Skills = dto.Skills;

//        //    await _jobRepository.UpdateJobAsync(job);

//        //    return Ok(job);
//        //}

//        // 🔥 UPDATE JOB (CLEANED)
//        [HttpPut("{id}")]
//        [Authorize(Roles = "Provider")]
//        public async Task<IActionResult> UpdateJob(int id, UpdateJobDto dto)
//        {
//            var userId = GetUserId();

//            if (userId == null)
//                return Unauthorized("User ID not found");

//            await _jobService.UpdateJobAsync(id, dto, userId.Value);

//            return Ok(new { message = "Job updated successfully" });
//        }




//        //[Authorize(Roles = "Provider")]
//        //[HttpDelete("{id}")]
//        //public async Task<IActionResult> DeleteJob(int id)
//        //{
//        //    var userId = GetUserId();

//        //    if (userId == null)
//        //        return Unauthorized("User not found");

//        //    var job = await _jobRepository.GetJobByIdAsync(id);

//        //    if (job == null)
//        //        return NotFound("Job not found");

//        //    // 🔒 ownership check
//        //    if (job.ProviderId != userId.Value)
//        //        return Forbid("You can only delete your own jobs");

//        //    await _jobRepository.DeleteJobAsync(id);

//        //    return Ok(new { message = "Job deleted successfully" });
//        //}

//        // 🔥 DELETE JOB (CLEANED)
//        [HttpDelete("{id}")]
//        [Authorize(Roles = "Provider")]
//        public async Task<IActionResult> DeleteJob(int id)
//        {
//            var userId = GetUserId();

//            if (userId == null)
//                return Unauthorized("User not found");

//            await _jobService.DeleteJobAsync(id, userId.Value);

//            return Ok(new { message = "Job deleted successfully" });
//        }





//    }
//}

using JobPortal.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using JobPortal.API.DTOs;
using JobPortal.Application.DTOs;

namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobController : ControllerBase
    {
        private readonly IJobService _jobService;
        private readonly IApplicationService _applicationService;

        public JobController(
            IJobService jobService,
            IApplicationService applicationService)
        {
            _jobService = jobService;
            _applicationService = applicationService;
        }

        private int? GetUserId()
        {
            var claim = User.Claims.FirstOrDefault(c =>
                c.Type == ClaimTypes.NameIdentifier ||
                c.Type.Contains("nameidentifier"));

            return int.TryParse(claim?.Value, out int id) ? id : null;
        }

        // 🔹 GET ALL JOBS (PAGINATED)
        [HttpGet]
        public async Task<IActionResult> GetJobs(int page = 1, int pageSize = 10)
        {
            pageSize = Math.Min(pageSize, 50);

            var (jobs, total) = await _jobService.GetPagedJobsAsync(page, pageSize);

            return Ok(new
            {
                data = jobs,
                total,
                page,
                pageSize
            });
        }

        // 🔹 CREATE JOB
        [HttpPost]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> CreateJob(CreateJobDto dto)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            await _jobService.CreateJobAsync(dto, userId.Value);

            return Ok(new { message = "Job Created Successfully" });
        }

        // 🔹 APPLY TO JOB
        [HttpPost("apply/{jobId}")]
        [Authorize(Roles = "Seeker")]
        public async Task<IActionResult> ApplyToJob(int jobId, [FromForm] ApplyJobRequest request)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            if (request.Resume == null || request.Resume.Length == 0)
                return BadRequest("Resume is required");

            using var ms = new MemoryStream();
            await request.Resume.CopyToAsync(ms);

            var dto = new ApplyJobDto
            {
                Resume = ms.ToArray(),
                FileName = request.Resume.FileName,
                CoverLetter = request.CoverLetter
            };

            await _applicationService.ApplyToJobAsync(jobId, userId.Value, dto);

            return Ok(new { message = "Applied successfully" });
        }

        // 🔥 GET MY JOBS (PAGINATED)
        [HttpGet("my-jobs")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> GetMyJobs(int page = 1, int pageSize = 10)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            pageSize = Math.Min(pageSize, 50);

            var (jobs, total) =
                await _jobService.GetPagedJobsByProviderAsync(userId.Value, page, pageSize);

            return Ok(new
            {
                data = jobs,
                total,
                page,
                pageSize
            });
        }

        //// 🔹 GET MY APPLICATIONS
        //[HttpGet("my-applications")]
        //[Authorize(Roles = "Seeker")]
        //public async Task<IActionResult> GetMyApplications()
        //{
        //    var userId = GetUserId();

        //    if (userId == null)
        //        return Unauthorized();

        //    var applications = await _applicationService.GetMyApplicationsAsync(userId.Value);

        //    return Ok(applications);
        //}

        [HttpGet("my-applications")]
        [Authorize(Roles = "Seeker")]
        public async Task<IActionResult> GetMyApplications(int page = 1, int pageSize = 10)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            pageSize = Math.Min(pageSize, 50);

            var (applications, total) =
                await _applicationService.GetPagedApplicationsForSeekerAsync(
                    userId.Value,
                    page,
                    pageSize
                );

            return Ok(new
            {
                data = applications,
                total,
                page,
                pageSize
            });
        }





        [HttpGet("applications")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> GetApplicationsForMyJobs(int page = 1, int pageSize = 10)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            pageSize = Math.Min(pageSize, 50);

            var (applications, total) =
                await _applicationService.GetPagedApplicationsForProviderAsync(
                    userId.Value,
                    page,
                    pageSize
                );

            return Ok(new
            {
                data = applications,
                total,
                page,
                pageSize
            });
        }

        // 🔹 UPDATE JOB
        [HttpPut("{id}")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> UpdateJob(int id, UpdateJobDto dto)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            await _jobService.UpdateJobAsync(id, dto, userId.Value);

            return Ok(new { message = "Job updated successfully" });
        }

        // 🔹 DELETE JOB
        [HttpDelete("{id}")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            await _jobService.DeleteJobAsync(id, userId.Value);

            return Ok(new { message = "Job deleted successfully" });
        }
    }
}