using JobPortal.Application.DTOs;
using JobPortal.Domain.Entities;

public interface IAuthService
{
    Task<(string token, string refreshToken)> LoginAsync(LoginDto dto);
    Task<User> RegisterAsync(RegisterUserDto dto);
    Task<string> RefreshTokenAsync(string refreshToken);
    Task LogoutAsync(string refreshToken);
}
