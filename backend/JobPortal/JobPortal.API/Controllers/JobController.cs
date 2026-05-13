using JobPortal.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using JobPortal.API.DTOs;
using JobPortal.Application.DTOs;
using JobPortal.Application.Exceptions;
using JobPortal.Application.Interfaces.Files;

namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobController : ControllerBase
    {
        private readonly IJobService _jobService;
        private readonly IApplicationService _applicationService;
        private readonly IResumeReaderService _resumeReaderService;

        public JobController(
            IJobService jobService,
            IApplicationService applicationService,
            IResumeReaderService resumeReaderService)
        {
            _jobService = jobService;
            _applicationService = applicationService;
            _resumeReaderService = resumeReaderService;
        }

        private int? GetUserId()
        {
            var claim = User.Claims.FirstOrDefault(c =>
                c.Type == ClaimTypes.NameIdentifier ||
                c.Type.Contains("nameidentifier"));

            return int.TryParse(claim?.Value, out int id) ? id : null;
        }

        // 🔹 GET ALL JOBS (PAGINATED)
        //[HttpGet]
        //public async Task<IActionResult> GetJobs(int page = 1, int pageSize = 10)
        //{
        //    pageSize = Math.Min(pageSize, 50);

        //    var (jobs, total) = await _jobService.GetPagedJobsAsync(page, pageSize);

        //    return Ok(new
        //    {
        //        data = jobs,
        //        total,
        //        page,
        //        pageSize
        //    });
        //}

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetJobs(int page = 1, int pageSize = 10)
        {
            pageSize = Math.Min(pageSize, 50);

            int? seekerId = null;

            // 🔥 Only get seekerId if logged-in user is a seeker
            if (User.IsInRole("Seeker"))
            {
                seekerId = GetUserId();
            }

            // 🔥 Pass seekerId into service
            var (jobs, total) =
                await _jobService.GetPagedJobsAsync(page, pageSize, seekerId);

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
        public async Task<IActionResult> CreateJob([FromBody] CreateJobDto dto)
        {
            var providerId = GetUserId();
            if (dto == null)
                throw new BadRequestException("Invalid request payload");
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            await _jobService.CreateJobAsync(dto, userId.Value);

            return Ok(new { message = "Job Created Successfully" });
        }

        [HttpPost("parse-resume")]
        [Authorize(Roles = "Seeker")]
        public async Task<IActionResult> ParseResume(
    [FromForm] ParseResumeRequest request)
        {
            if (request.Resume == null ||
                request.Resume.Length == 0)
            {
                throw new BadRequestException(
                    "Resume is required");
            }

            var extension =
                Path.GetExtension(request.Resume.FileName)
                    .ToLower();

            if (extension != ".pdf")
            {
                throw new BadRequestException(
                    "Only PDF resumes are allowed");
            }

            byte[] fileBytes;

            using (var ms = new MemoryStream())
            {
                await request.Resume.CopyToAsync(ms);
                fileBytes = ms.ToArray();
            }

            var parsedResume =
                await _resumeReaderService.ReadResumeAsync(
                    fileBytes,
                    request.Resume.FileName);

            return Ok(new
            {
                candidateName =
                    parsedResume.CandidateName,

                email =
                    parsedResume.Email,

                phoneNumber =
                    parsedResume.PhoneNumber,

                skills =
                    parsedResume.Skills
            });
        }

        //// 🔹 APPLY TO JOB
        //[HttpPost("apply/{jobId}")]
        //[Authorize(Roles = "Seeker")]
        //public async Task<IActionResult> ApplyToJob(int jobId, [FromForm] ApplyJobRequest request)
        //{
        //    var userId = GetUserId();

        //    if (userId == null)
        //        return Unauthorized();

        //    if (request.Resume == null || request.Resume.Length == 0)
        //        throw new BadRequestException("Resume is required");

        //    using var ms = new MemoryStream();
        //    await request.Resume.CopyToAsync(ms);

        //    var dto = new ApplyJobDto
        //    {
        //        Resume = ms.ToArray(),
        //        FileName = request.Resume.FileName,
        //        CoverLetter = request.CoverLetter
        //    };

        //    await _applicationService.ApplyToJobAsync(jobId, userId.Value, dto);

        //    return Ok(new { message = "Applied successfully" });
        //}

        [HttpPost("apply/{jobId}")]
        [Authorize(Roles = "Seeker")]
        public async Task<IActionResult> ApplyToJob(
    int jobId,
    [FromForm] ApplyJobRequest request)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            if (request.Resume == null || request.Resume.Length == 0)
            {
                throw new BadRequestException("Resume is required");
            }

            var extension =
                Path.GetExtension(request.Resume.FileName).ToLower();

            if (extension != ".pdf")
            {
                throw new BadRequestException(
                    "Only PDF resumes are allowed");
            }

            byte[] fileBytes;

            using (var ms = new MemoryStream())
            {
                await request.Resume.CopyToAsync(ms);
                fileBytes = ms.ToArray();
            }

            var dto = new ApplyJobDto
            {
                Resume = fileBytes,
                FileName = request.Resume.FileName,
                CoverLetter = request.CoverLetter
            };

            await _applicationService.ApplyToJobAsync(
                jobId,
                userId.Value,
                dto);

            return Ok(new
            {
                message = "Applied successfully"
            });
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

        [HttpPut("applications/{id}/status")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> UpdateApplicationStatus(int id, [FromBody] UpdateStatusDto dto)
        {
            var userId = GetUserId();

            if (userId == null)
                return Unauthorized();

            await _applicationService.UpdateApplicationStatusAsync(
                id,
                dto.Status,
                userId.Value
            );

            return Ok(new { message = "Application status updated successfully" });
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

        [HttpPost("bulk")]
        [Authorize(Roles = "Provider")]
        public async Task<IActionResult> BulkCreateJobs([FromBody]List<CreateJobDto> jobs)
        {

            var userId = GetUserId();
            if (jobs == null || !jobs.Any())
                throw new BadRequestException("No jobs provided");

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
                return Unauthorized();

            var providerId = int.Parse(userIdClaim.Value);

            var result = await _jobService.BulkCreateAsync(jobs, providerId);

            return Ok(result);
        }

    }
}