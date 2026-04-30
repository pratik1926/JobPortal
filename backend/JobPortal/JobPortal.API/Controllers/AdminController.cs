using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JobPortal.Application.Interfaces;
//using JobPortal.Infrastructure.Persistence;
//using Microsoft.EntityFrameworkCore;
using JobPortal.API.Hubs;
using Microsoft.AspNetCore.SignalR;
using JobPortal.Application.Services;

namespace JobPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] // 🔥 CRITICAL
    public class AdminController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IJobService _jobService;
        private readonly IAdminService _adminService;
        private readonly IHubContext<NotificationHub> _hubContext;
        public AdminController(IUserService userService,
            IJobService jobService,
            IAdminService adminService,
            IHubContext<NotificationHub> hubContext)

        {

            _userService = userService;
            _jobService = jobService;
            _adminService = adminService;
            _hubContext = hubContext;
        }

        // ✅ GET all users
        //[HttpGet("users")]
        //public async Task<IActionResult> GetAllUsers()
        //{
        //    var users = await _userRepository.GetAllUsersAsync();
        //    return Ok(users);
        //}
        //[HttpGet("users")]
        //public async Task<IActionResult> GetAllUsers(int page = 1, int pageSize = 10)
        //{
        //    pageSize = Math.Min(pageSize, 50);

        //    var (users, total) = await _userRepository.GetPagedUsersAsync(page, pageSize);

        //    var result = users.Select(u => new
        //    {
        //        u.Id,
        //        u.Name,
        //        u.Email,
        //        u.Role,
        //        u.IsBanned
        //    });

        //    return Ok(new
        //    {
        //        data = result,
        //        total,
        //        page,
        //        pageSize
        //    });
        //}

        // ✅ GET PAGINATED USERS
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers(int page = 1, int pageSize = 10)
        {
            pageSize = Math.Min(pageSize, 50);

            var (users, total) = await _userService.GetPagedUsersAsync(page, pageSize);

            return Ok(new
            {
                data = users,
                total,
                page,
                pageSize
            });
        }

        //// ✅ DELETE user
        //[HttpDelete("users/{id}")]
        //public async Task<IActionResult> DeleteUser(int id)
        //{
        //    var success = await _userRepository.DeleteUserAsync(id);

        //    if (!success)
        //        return NotFound("User not found");

        //    return Ok("User deleted successfully");
        //}

        // 🔥 NEW: BAN USER
        //[HttpPut("ban/{id}")]
        //public async Task<IActionResult> BanUser(int id)
        //{
        //    var result = await _userRepository.BanUserAsync(id);

        //    if (!result)
        //        return NotFound(new { message = "User not found" });

        //    // 🔥 notify dashboard
        //    await _hubContext.Clients.All.SendAsync("ReceiveAdminUpdate");

        //    return Ok(new { message = "User banned successfully" });
        //}

        // 🔥 BAN USER
        [HttpPut("ban/{id}")]
        public async Task<IActionResult> BanUser(int id)
        {
            var result = await _userService.BanUserAsync(id);

            if (!result)
                return NotFound(new { message = "User not found" });

            await _hubContext.Clients.All.SendAsync("ReceiveAdminUpdate");

            return Ok(new { message = "User banned successfully" });
        }

        //[HttpDelete("users/{id}")]
        //public async Task<IActionResult> DeleteUser(int id)
        //{
        //    var result = await _userRepository.DeleteUserAsync(id);

        //    if (!result)
        //        return NotFound(new { message = "User not found" });

        //    return Ok(new { message = "User deleted successfully" });
        //}

        // 🔥 DELETE USER
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _userService.DeleteUserAsync(id);

            if (!result)
                return NotFound(new { message = "User not found" });

            return Ok(new { message = "User deleted successfully" });
        }


        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")]
        //public async Task<IActionResult> GetAllJobsForAdmin()
        //{
        //    var jobs = await _jobRepository.GetAllJobsForAdminAsync();

        //    return Ok(jobs);
        //}
        public async Task<IActionResult> GetAllJobsForAdmin(int page = 1, int pageSize = 10)
{
    pageSize = Math.Min(pageSize, 50);

    var (jobs, total) = await _jobService.GetPagedJobsForAdminAsync(page, pageSize);

    return Ok(new
    {
        data = jobs,
        total,
        page,
        pageSize
    });
}

        //[HttpPut("unban/{id}")]
        //public async Task<IActionResult> UnbanUser(int id)
        //{
        //    var result = await _userRepository.UnbanUserAsync(id);

        //    if (!result)
        //        return NotFound(new { message = "User not found" });

        //    await _hubContext.Clients.All.SendAsync("ReceiveAdminUpdate");

        //    return Ok(new { message = "User unbanned successfully" });
        //}

        // 🔥 UNBAN USER
        [HttpPut("unban/{id}")]
        public async Task<IActionResult> UnbanUser(int id)
        {
            var result = await _userService.UnbanUserAsync(id);

            if (!result)
                return NotFound(new { message = "User not found" });

            await _hubContext.Clients.All.SendAsync("ReceiveAdminUpdate");

            return Ok(new { message = "User unbanned successfully" });
        }

        [HttpGet("analytics")]
        public async Task<IActionResult> GetAnalytics()
        {
            var data = await _adminService.GetAnalyticsAsync();
            return Ok(data);
        }


    }
}