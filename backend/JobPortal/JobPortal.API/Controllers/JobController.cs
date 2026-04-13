using JobPortal.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using JobPortal.Domain.Entities;
using JobPortal.Application.DTOs;

namespace JobPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobController: ControllerBase
    {
        private readonly IJobRepository _jobRepository;
        public JobController(IJobRepository jobRepository)
        {
            _jobRepository = jobRepository;
        }
        [HttpGet]
        public async Task<IActionResult> GetJobs()
        {
            var jobs = await _jobRepository.GetAllJobsAsync();
            var result = jobs.Select(j => new JobResponseDto
            {
                Id = j.Id,
                Title = j.Title,
                Budget = j.Budget,
                Location = j.Location
            }).ToList();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateJob(CreateJobDto dto)
        {
            var job = new Job
            {
                Title = dto.Title,
                Description = dto.Description,
                Budget = dto.Budget,
                Location = dto.Location,
                ProviderId = dto.ProviderId
            };

            await _jobRepository.AddJobAsync(job);

            return Ok("Job created successfully");
        }
    }
}
