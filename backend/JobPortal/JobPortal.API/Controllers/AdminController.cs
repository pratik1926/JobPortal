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
        
        private readonly IJobRepository _jobRepository;
        public AdminController(IUserRepository userRepository)
        {
            
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
            var jobs = await _jobRepository.GetAllJobsForAdminAsync();

            return Ok(jobs);
        }

    }
}