using JobPortal.Application.DTOs;
using JobPortal.Application.Interfaces;
using JobPortal.Domain.Entities;
using BCrypt.Net;

namespace JobPortal.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtTokenGenerator _jwtTokenGenerator;

        public AuthService(IUserRepository userRepository, IJwtTokenGenerator jwtTokenGenerator)
        {
            _userRepository = userRepository;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task<User> RegisterAsync(RegisterUserDto dto)
        {
            //if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
            //    throw new ArgumentException("Email and Passwords are required");

            var existingUser = await _userRepository.GetUserByEmailAsync(dto.Email);
            if (existingUser != null)
                throw new InvalidOperationException("User already exist");

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role
            };

            return await _userRepository.RegisterUserAsync(user);
        }

        public async Task<(string token, string refreshToken)> LoginAsync(LoginDto dto)
        {
            var user = await _userRepository.GetUserByEmailAsync(dto.Email);

            if (user == null || user.IsDeleted || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new UnauthorizedAccessException("Invalid credentials");

            var accessToken = _jwtTokenGenerator.GenerateToken(user);
            var refreshToken = _jwtTokenGenerator.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            await _userRepository.UpdateUserAsync(user);

            return (accessToken, refreshToken);
        }

        public async Task<string> RefreshTokenAsync(string refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken))
                throw new UnauthorizedAccessException("No refresh token");

            var user = await _userRepository.GetUserByRefreshTokenAsync(refreshToken);

            if (user == null ||user.IsDeleted || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
                throw new UnauthorizedAccessException("Invalid or expired refresh token");

            return _jwtTokenGenerator.GenerateToken(user);
        }

        public async Task LogoutAsync(string refreshToken)
        {
            if (!string.IsNullOrEmpty(refreshToken))
            {
                var user = await _userRepository.GetUserByRefreshTokenAsync(refreshToken);

                if (user != null)
                {
                    user.RefreshToken = null;
                    user.RefreshTokenExpiryTime = null;

                    await _userRepository.UpdateUserAsync(user);
                }
            }
        }
    }
}