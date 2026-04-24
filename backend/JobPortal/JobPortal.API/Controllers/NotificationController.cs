using Microsoft.AspNetCore.Mvc;
using JobPortal.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _service;

    public NotificationController(INotificationService service)
    {
        _service = service;
    }

    // 🔔 GET MY NOTIFICATIONS (SECURE)
    [HttpGet]
    public async Task<IActionResult> GetMyNotifications()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
            return Unauthorized();

        var userId = int.Parse(userIdClaim.Value);

        var data = await _service.GetUserNotifications(userId);

        return Ok(data);
    }

    // 🔔 CREATE (optional - mostly used internally)
    [HttpPost]
    public async Task<IActionResult> Create(CreateNotificationDto dto)
    {
        await _service.CreateAsync(dto);
        return Ok("Notification created");
    }

    // 🔔 MARK SINGLE AS READ
    [HttpPut("read/{id}")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        await _service.MarkAsRead(id);
        return Ok(new { message = "Notification marked as read" });
    }

    // 🔔 MARK ALL AS READ (SECURE)
    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null)
            return Unauthorized();

        var userId = int.Parse(userIdClaim.Value);

        await _service.MarkAllAsRead(userId);

        return Ok(new { message = "All notifications marked as read" });
    }
}