using JobPortal.Application.DTOs;
using JobPortal.Application.DTOs.Auth;
using JobPortal.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using JobPortal.API.Hubs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace JobPortal.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly IUserService _userService;
    public UserController(IAuthService authService, IHubContext<NotificationHub> hubContext, IUserService userService)
    {
        _authService = authService;
        _hubContext = hubContext;
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterUserDto dto)
    {
        var user = await _authService.RegisterAsync(dto);

        return StatusCode(201, new
        {
            message = "User Registered Successfully",
            userId = user.Id
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var (token, refreshToken) = await _authService.LoginAsync(dto);

        Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = "/",
            Expires = DateTime.UtcNow.AddDays(7)
        });

        return Ok(new { token });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];

        var newAccessToken = await _authService.RefreshTokenAsync(refreshToken);

        return Ok(new { token = newAccessToken });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var refreshToken = Request.Cookies["refreshToken"];

        await _authService.LogoutAsync(refreshToken);

        Response.Cookies.Delete("refreshToken");

        return Ok("Logged out successfully");
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        await _authService.ForgotPasswordAsync(dto.Email);
        return Ok("OTP sent to email");
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        await _authService.ResetPasswordAsync(dto.Email, dto.NewPassword);
        return Ok("Password reset successful");
    }

    [HttpGet("test-notification")]
    public async Task<IActionResult> TestNotification()
    {
        await _hubContext.Clients.All.SendAsync("ReceiveNotification", new
        {
            message = "Hello from SignalR 🚀"
        });

        return Ok("Notification sent");
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> GetProfile()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        var user = await _userService.GetProfileAsync(userId);
        return Ok(user);
    }

    [HttpPut("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

        await _userService.ChangePasswordAsync(userId, dto);

        return Ok(new { message = "Password updated successfully" });
    }
}