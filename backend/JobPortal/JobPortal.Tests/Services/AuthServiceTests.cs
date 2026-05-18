using FluentAssertions;
using JobPortal.Application.DTOs.Users;
using JobPortal.Application.Interfaces.Email;
using JobPortal.Application.Interfaces.Users;
using JobPortal.Application.Interfaces.Verification;
using JobPortal.Application.Services;
using JobPortal.Domain.Entities;
using Moq;
using Xunit;

namespace JobPortal.Tests.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IUserRepository>
            _userRepositoryMock;

        private readonly Mock<IJwtTokenGenerator>
            _jwtTokenGeneratorMock;

        private readonly Mock<IEmailVerificationRepository>
            _emailVerificationRepositoryMock;

        private readonly Mock<IVerificationService>
            _verificationServiceMock;

        private readonly AuthService
            _authService;

        public AuthServiceTests()
        {
            _userRepositoryMock =
                new Mock<IUserRepository>();

            _jwtTokenGeneratorMock =
                new Mock<IJwtTokenGenerator>();

            _emailVerificationRepositoryMock =
                new Mock<IEmailVerificationRepository>();

            _verificationServiceMock =
                new Mock<IVerificationService>();

            _authService =
                new AuthService(
                    _userRepositoryMock.Object,
                    _jwtTokenGeneratorMock.Object,
                    _emailVerificationRepositoryMock.Object,
                    _verificationServiceMock.Object
                );
        }

        [Fact]
        public async Task
RegisterAsync_Should_Throw_When_Email_Not_Verified()
        {
            

            var dto =
                new RegisterUserDto
                {
                    Name = "Pratik",
                    Email = "test@gmail.com",
                    Password = "123456",
                    Role = "Seeker"
                };

            _emailVerificationRepositoryMock
                .Setup(x =>
                    x.GetLatestVerifiedAsync(
                        dto.Email.ToLower()))
                .ReturnsAsync(
                    (EmailVerification?)null);

            

            Func<Task> act = async () =>
                await _authService
                    .RegisterAsync(dto);

         

            await act.Should()
                .ThrowAsync<InvalidOperationException>()
                .WithMessage(
                    "Please verify your email before registering");
        }

        [Fact]
        public async Task
RegisterAsync_Should_Throw_When_User_Already_Exists()
        {
            

            var dto =
                new RegisterUserDto
                {
                    Name = "Pratik",
                    Email = "test@gmail.com",
                    Password = "123456",
                    Role = "Seeker"
                };

            var verification =
                new EmailVerification
                {
                    Email = dto.Email,
                    Expiry = DateTime.UtcNow.AddMinutes(10)
                };

            _emailVerificationRepositoryMock
                .Setup(x =>
                    x.GetLatestVerifiedAsync(
                        dto.Email.ToLower()))
                .ReturnsAsync(verification);

            _userRepositoryMock
                .Setup(x =>
                    x.GetUserByEmailAsync(
                        dto.Email.ToLower()))
                .ReturnsAsync(
                    new User
                    {
                        Id = 1,
                        Email = dto.Email
                    });

        

            Func<Task> act = async () =>
                await _authService
                    .RegisterAsync(dto);

            

            await act.Should()
                .ThrowAsync<InvalidOperationException>()
                .WithMessage(
                    "User already exists");
        }

        [Fact]
        public async Task
RegisterAsync_Should_Register_User_Successfully()
        {
           

            var dto =
                new RegisterUserDto
                {
                    Name = "Pratik",
                    Email = "test@gmail.com",
                    Password = "123456",
                    Role = "Seeker"
                };

            var verification =
                new EmailVerification
                {
                    Email = dto.Email,
                    Expiry = DateTime.UtcNow.AddMinutes(10)
                };

            _emailVerificationRepositoryMock
                .Setup(x =>
                    x.GetLatestVerifiedAsync(
                        dto.Email.ToLower()))
                .ReturnsAsync(verification);

            _userRepositoryMock
                .Setup(x =>
                    x.GetUserByEmailAsync(
                        dto.Email.ToLower()))
                .ReturnsAsync(
                    (User?)null);

            _userRepositoryMock
                .Setup(x =>
                    x.RegisterUserAsync(
                        It.IsAny<User>()))
                .ReturnsAsync(
                    (User u) => u);

            

            var result =
                await _authService
                    .RegisterAsync(dto);

           

            result.Should().NotBeNull();

            result.Email
                .Should().Be(
                    dto.Email.ToLower());

            result.Role
                .Should().Be(dto.Role);

            result.PasswordHash
                .Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async Task
LoginAsync_Should_Throw_When_User_Not_Found()
        {

            var dto =
                new LoginDto
                {
                    Email = "test@gmail.com",
                    Password = "123456"
                };

            _userRepositoryMock
                .Setup(x =>
                    x.GetUserByEmailAsync(
                        dto.Email))
                .ReturnsAsync(
                    (User?)null);

           

            Func<Task> act = async () =>
                await _authService
                    .LoginAsync(dto);

            await act.Should()
                .ThrowAsync<UnauthorizedAccessException>()
                .WithMessage(
                    "Invalid credentials");
        }

        [Fact]
        public async Task
LoginAsync_Should_Return_Tokens_When_Valid()
        {
          

            var password =
                "123456";

            var hashedPassword =
                BCrypt.Net.BCrypt.HashPassword(
                    password);

            var user =
                new User
                {
                    Id = 1,
                    Email = "test@gmail.com",
                    PasswordHash = hashedPassword,
                    Role = "Seeker",
                    IsBanned = false,
                    IsDeleted = false
                };

            var dto =
                new LoginDto
                {
                    Email = user.Email,
                    Password = password
                };

            _userRepositoryMock
                .Setup(x =>
                    x.GetUserByEmailAsync(
                        dto.Email))
                .ReturnsAsync(user);

            _jwtTokenGeneratorMock
                .Setup(x =>
                    x.GenerateToken(user))
                .Returns("jwt-token");

            _jwtTokenGeneratorMock
                .Setup(x =>
                    x.GenerateRefreshToken())
                .Returns("refresh-token");

    

            var result =
                await _authService
                    .LoginAsync(dto);

      
            result.token
                .Should().Be("jwt-token");

            result.refreshToken
                .Should().Be("refresh-token");
        }

        [Fact]
        public async Task
LoginAsync_Should_Throw_When_User_Banned()
        {

            var password =
                "123456";

            var hashedPassword =
                BCrypt.Net.BCrypt.HashPassword(
                    password);

            var user =
                new User
                {
                    Email = "test@gmail.com",
                    PasswordHash = hashedPassword,
                    IsBanned = true
                };

            var dto =
                new LoginDto
                {
                    Email = user.Email,
                    Password = password
                };

            _userRepositoryMock
                .Setup(x =>
                    x.GetUserByEmailAsync(
                        dto.Email))
                .ReturnsAsync(user);

         

            Func<Task> act = async () =>
                await _authService
                    .LoginAsync(dto);


            await act.Should()
                .ThrowAsync<UnauthorizedAccessException>()
                .WithMessage(
                    "Account is banned");
        }
    }
}