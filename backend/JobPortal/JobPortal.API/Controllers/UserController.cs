using JobPortal.Application.DTOs;
using JobPortal.Application.Interfaces;
using JobPortal.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace JobPortal.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    // ✅ UPDATED CONSTRUCTOR
    public UserController(IUserRepository userRepository, IJwtTokenGenerator jwtTokenGenerator)
    {
        _userRepository = userRepository;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    // ✅ REGISTER API
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterUserDto dto)
    {
        if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
            return BadRequest(new { message = "Email and Passwords are required" });

        var existingUser = await _userRepository.GetUserByEmailAsync(dto.Email);
        if (existingUser != null)
        {
            return BadRequest(new { message = "User already exist" });
        }


        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = dto.Role
        };

        var result = await _userRepository.RegisterUserAsync(user);

        return StatusCode(201, new { message = "User Registered Successfully", UserId = result.Id });
    }

    // ✅ LOGIN API (JWT)
    //[HttpPost("login")]
    //public async Task<IActionResult> Login(LoginDto dto)
    //{
    //    if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
    //        return BadRequest(new { message = "Email and Password are required" });

    //    var user = await _userRepository.GetUserByEmailAsync(dto.Email);

    //    if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
    //        return Unauthorized("Invalid credentials");

    //    var token = _jwtTokenGenerator.GenerateToken(user);

    //    return Ok(new { token });
    //}

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _userRepository.GetUserByEmailAsync(dto.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized("Invalid credentials");

        var accessToken = _jwtTokenGenerator.GenerateToken(user);
        var refreshToken = _jwtTokenGenerator.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        await _userRepository.UpdateUserAsync(user);

        Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(7)
        });

        return Ok(new { token = accessToken });
    }

    [HttpGet("test-refresh")]
    public async Task<IActionResult> TestRefresh(string token)
    {
        var user = await _userRepository.GetUserByRefreshTokenAsync(token);

        if (user == null)
            return NotFound("User not found");

        return Ok(user.Email);
    }
}