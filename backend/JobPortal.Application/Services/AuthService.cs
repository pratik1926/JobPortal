//using JobPortal.Application.DTOs;
//using JobPortal.Application.Interfaces;
//using JobPortal.Domain.Entities;
//using BCrypt.Net;

//namespace JobPortal.Application.Services
//{
//    public class AuthService : IAuthService
//    {
//        private readonly IUserRepository _userRepository;
//        private readonly IJwtTokenGenerator _jwtTokenGenerator;

//        public AuthService(IUserRepository userRepository, IJwtTokenGenerator jwtTokenGenerator)
//        {
//            _userRepository = userRepository;
//            _jwtTokenGenerator = jwtTokenGenerator;
//        }

//        public async Task<User> RegisterAsync(RegisterUserDto dto)
//        {
//            //if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.Password))
//            //    throw new ArgumentException("Email and Passwords are required");

//            var existingUser = await _userRepository.GetUserByEmailAsync(dto.Email);
//            if (existingUser != null)
//                throw new InvalidOperationException("User already exist");

//            var user = new User
//            {
//                Name = dto.Name,
//                Email = dto.Email,
//                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
//                Role = dto.Role
//            };

//            return await _userRepository.RegisterUserAsync(user);
//        }

//        public async Task<(string token, string refreshToken)> LoginAsync(LoginDto dto)
//        {
//            var user = await _userRepository.GetUserByEmailAsync(dto.Email);

//            if (user == null || user.IsDeleted || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
//                throw new UnauthorizedAccessException("Invalid credentials");

//            var accessToken = _jwtTokenGenerator.GenerateToken(user);
//            var refreshToken = _jwtTokenGenerator.GenerateRefreshToken();

//            user.RefreshToken = refreshToken;
//            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

//            await _userRepository.UpdateUserAsync(user);

//            return (accessToken, refreshToken);
//        }

//        public async Task<string> RefreshTokenAsync(string refreshToken)
//        {
//            if (string.IsNullOrEmpty(refreshToken))
//                throw new UnauthorizedAccessException("No refresh token");

//            var user = await _userRepository.GetUserByRefreshTokenAsync(refreshToken);

//            if (user == null ||user.IsDeleted || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
//                throw new UnauthorizedAccessException("Invalid or expired refresh token");

//            return _jwtTokenGenerator.GenerateToken(user);
//        }

//        public async Task LogoutAsync(string refreshToken)
//        {
//            if (!string.IsNullOrEmpty(refreshToken))
//            {
//                var user = await _userRepository.GetUserByRefreshTokenAsync(refreshToken);

//                if (user != null)
//                {
//                    user.RefreshToken = null;
//                    user.RefreshTokenExpiryTime = null;

//                    await _userRepository.UpdateUserAsync(user);
//                }
//            }
//        }
//    }
//}

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
        private readonly IEmailVerificationRepository _emailVerificationRepository;

        public AuthService(
            IUserRepository userRepository,
            IJwtTokenGenerator jwtTokenGenerator,
            IEmailVerificationRepository emailVerificationRepository)
        {
            _userRepository = userRepository;
            _jwtTokenGenerator = jwtTokenGenerator;
            _emailVerificationRepository = emailVerificationRepository;
        }

        public async Task<User> RegisterAsync(RegisterUserDto dto)
        {
            var email = dto.Email.ToLower();

            // ✅ 1. CHECK EMAIL VERIFICATION (CRITICAL)
            var verification = await _emailVerificationRepository.GetLatestVerifiedAsync(email);

            if (verification == null)
                throw new InvalidOperationException("Please verify your email before registering");

            // optional expiry check (extra safety)
            if (verification.Expiry < DateTime.UtcNow)
                throw new InvalidOperationException("Verification expired. Please verify again");

            // ✅ 2. CHECK EXISTING USER
            var existingUser = await _userRepository.GetUserByEmailAsync(email);
            if (existingUser != null)
                throw new InvalidOperationException("User already exists");

            // ✅ 3. CREATE USER
            var user = new User
            {
                Name = dto.Name,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role
            };

            var createdUser = await _userRepository.RegisterUserAsync(user);

            // ✅ 4. CONSUME VERIFICATION (VERY IMPORTANT)
            await _emailVerificationRepository.MarkAsUsedAsync(verification);

            return createdUser;
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

            if (user == null || user.IsDeleted || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
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