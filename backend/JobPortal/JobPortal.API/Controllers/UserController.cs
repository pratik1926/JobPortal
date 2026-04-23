using JobPortal.Application.DTOs;
using JobPortal.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JobPortal.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IAuthService _authService;

    public UserController(IAuthService authService)
    {
        _authService = authService;
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
}