//using JobPortal.Application.DTOs;
//using JobPortal.Application.Interfaces;
//using JobPortal.Domain.Entities;
//using Microsoft.AspNetCore.Mvc;

//namespace JobPortal.API.Controllers;

//[Route("api/[controller]")]
//[ApiController]
//public class UserController : ControllerBase
//{
//    private readonly IUserRepository _userRepository;
//    private readonly IJwtTokenGenerator _jwtTokenGenerator;

//    // ✅ UPDATED CONSTRUCTOR
//    public UserController(IUserRepository userRepository, IJwtTokenGenerator jwtTokenGenerator)
//    {
//        _userRepository = userRepository;
//        _jwtTokenGenerator = jwtTokenGenerator;
//    }

//    // ✅ REGISTER API
//    [HttpPost("register")]
//    public async Task<IActionResult> Register(RegisterUserDto dto)
//    {
//        if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
//            return BadRequest(new { message = "Email and Passwords are required" });

//        var existingUser = await _userRepository.GetUserByEmailAsync(dto.Email);
//        if (existingUser != null)
//        {
//            return BadRequest(new { message = "User already exist" });
//        }


//        var user = new User
//        {
//            Name = dto.Name,
//            Email = dto.Email,
//            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
//            Role = dto.Role
//        };

//        var result = await _userRepository.RegisterUserAsync(user);

//        return StatusCode(201, new { message = "User Registered Successfully", UserId = result.Id });
//    }

//    // ✅ LOGIN API (JWT)
//    //[HttpPost("login")]
//    //public async Task<IActionResult> Login(LoginDto dto)
//    //{
//    //    if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
//    //        return BadRequest(new { message = "Email and Password are required" });

//    //    var user = await _userRepository.GetUserByEmailAsync(dto.Email);

//    //    if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
//    //        return Unauthorized("Invalid credentials");

//    //    var token = _jwtTokenGenerator.GenerateToken(user);

//    //    return Ok(new { token });
//    //}

//    [HttpPost("login")]
//    public async Task<IActionResult> Login(LoginDto dto)
//    {
//        var user = await _userRepository.GetUserByEmailAsync(dto.Email);

//        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
//            return Unauthorized("Invalid credentials");

//        var accessToken = _jwtTokenGenerator.GenerateToken(user);
//        var refreshToken = _jwtTokenGenerator.GenerateRefreshToken();

//        user.RefreshToken = refreshToken;
//        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

//        await _userRepository.UpdateUserAsync(user);

//        Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
//        {
//            HttpOnly = true,
//            Secure = true,
//            SameSite = SameSiteMode.None,
//            Path = "/",
//            Expires = DateTime.UtcNow.AddDays(7)
//        });

//        return Ok(new { token = accessToken });
//    }

//    [HttpPost("refresh")]
//    public async Task<IActionResult> RefreshToken()
//    {
//        var refreshToken = Request.Cookies["refreshToken"];

//        if (string.IsNullOrEmpty(refreshToken))
//            return Unauthorized("No refresh token");

//        var user = await _userRepository.GetUserByRefreshTokenAsync(refreshToken);

//        if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
//            return Unauthorized("Invalid or expired refresh token");

//        var newAccessToken = _jwtTokenGenerator.GenerateToken(user);

//        return Ok(new { token = newAccessToken });
//    }

//    [HttpPost("logout")]
//    public async Task<IActionResult> Logout()
//    {
//        var refreshToken = Request.Cookies["refreshToken"];

//        if (!string.IsNullOrEmpty(refreshToken))
//        {
//            var user = await _userRepository.GetUserByRefreshTokenAsync(refreshToken);

//            if (user != null)
//            {
//                user.RefreshToken = null;
//                user.RefreshTokenExpiryTime = null;

//                await _userRepository.UpdateUserAsync(user);
//            }
//        }

//        Response.Cookies.Delete("refreshToken");

//        return Ok("Logged out successfully");
//    }
//}

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

    // ✅ REGISTER
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterUserDto dto)
    {
        
            var user = await _authService.RegisterAsync(dto);

            return StatusCode(201, new
            {
                message = "User Registered Successfully",
                UserId = user.Id
            });
        
    }

    // ✅ LOGIN
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

    // ✅ REFRESH
    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken()
    {
        
            var refreshToken = Request.Cookies["refreshToken"];

            var token = await _authService.RefreshTokenAsync(refreshToken);

            return Ok(new { token });
        
    }

    // ✅ LOGOUT
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var refreshToken = Request.Cookies["refreshToken"];

        await _authService.LogoutAsync(refreshToken);

        Response.Cookies.Delete("refreshToken");

        return Ok("Logged out successfully");
    }
}