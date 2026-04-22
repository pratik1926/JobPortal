using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JobPortal.Application.Interfaces;
using JobPortal.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] // 🔥 CRITICAL
    public class AdminController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly JobPortalDbContext _context;

        public AdminController(IUserRepository userRepository,
            JobPortalDbContext context)
        {
            _context = context;
            _userRepository = userRepository;
        }

        // ✅ GET all users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepository.GetAllUsersAsync();
            return Ok(users);
        }

        // ✅ DELETE user
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var success = await _userRepository.DeleteUserAsync(id);

            if (!success)
                return NotFound("User not found");

            return Ok("User deleted successfully");
        }

        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllJobsForAdmin()
        {
            var jobs = await _context.Jobs
                .Include(j => j.Provider)
                .Select(j => new JobDto
                {
                    Id = j.Id,
                    Title = j.Title,
                    Description = j.Description,
                    Budget = j.Budget,
                    Location = j.Location,
                    CreatedAt = j.CreatedAt,
                    Skills = j.Skills,
                    ProviderName = j.Provider.Name,
                    ProviderEmail = j.Provider.Email
                })
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();

            return Ok(jobs);
        }

    }
}