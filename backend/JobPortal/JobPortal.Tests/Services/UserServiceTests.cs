using FluentAssertions;
using JobPortal.Application.DTOs.Users;
using JobPortal.Application.Exceptions;
using JobPortal.Application.Interfaces.Users;
using JobPortal.Application.Services;
using JobPortal.Domain.Entities;
using Moq;
using Xunit;

namespace JobPortal.Tests.Services
{
    public class UserServiceTests
    {
        private readonly Mock<IUserRepository>
            _userRepositoryMock;

        private readonly UserService
            _service;

        public UserServiceTests()
        {
            _userRepositoryMock =
                new Mock<IUserRepository>();

            _service =
                new UserService(
                    _userRepositoryMock.Object
                );
        }

        [Fact]
        public async Task
GetProfileAsync_Should_Throw_When_User_NotFound()
        {
            // ARRANGE

            _userRepositoryMock
                .Setup(x =>
                    x.GetUserByIdAsync(1))
                .ReturnsAsync((User?)null);

            // ACT

            Func<Task> act = async () =>
                await _service.GetProfileAsync(1);

            // ASSERT

            await act.Should()
                .ThrowAsync<NotFoundException>()
                .WithMessage("User not found");
        }

        [Fact]
        public async Task
GetProfileAsync_Should_Return_Profile()
        {
            // ARRANGE

            var user =
                new User
                {
                    Id = 1,
                    Name = "Pratik",
                    Email = "test@gmail.com",
                    Role = "Provider"
                };

            _userRepositoryMock
                .Setup(x =>
                    x.GetUserByIdAsync(1))
                .ReturnsAsync(user);

            // ACT

            var result =
                await _service.GetProfileAsync(1);

            // ASSERT

            result.Name
                .Should().Be("Pratik");

            result.Email
                .Should().Be("test@gmail.com");

            result.Role
                .Should().Be("Provider");
        }

        [Fact]
        public async Task
ChangePasswordAsync_Should_Throw_When_User_NotFound()
        {
            // ARRANGE

            _userRepositoryMock
                .Setup(x =>
                    x.GetUserByIdAsync(1))
                .ReturnsAsync((User?)null);

            // ACT

            Func<Task> act = async () =>
                await _service.ChangePasswordAsync(
                    1,
                    new ChangePasswordDto());

            // ASSERT

            await act.Should()
                .ThrowAsync<NotFoundException>()
                .WithMessage("User not found");
        }

        [Fact]
        public async Task
ChangePasswordAsync_Should_Throw_When_CurrentPassword_Invalid()
        {
            // ARRANGE

            var user =
                new User
                {
                    Id = 1,
                    PasswordHash =
                        BCrypt.Net.BCrypt.HashPassword("old123")
                };

            _userRepositoryMock
                .Setup(x =>
                    x.GetUserByIdAsync(1))
                .ReturnsAsync(user);

            var dto =
                new ChangePasswordDto
                {
                    CurrentPassword = "wrong-password",
                    NewPassword = "new123"
                };

            // ACT

            Func<Task> act = async () =>
                await _service.ChangePasswordAsync(
                    1,
                    dto);

            // ASSERT

            await act.Should()
                .ThrowAsync<BadRequestException>()
                .WithMessage(
                    "Current password is incorrect");
        }

        [Fact]
        public async Task
ChangePasswordAsync_Should_Update_HashedPassword()
        {
            // ARRANGE

            var oldHash =
                BCrypt.Net.BCrypt
                    .HashPassword("old123");

            var user =
                new User
                {
                    Id = 1,
                    PasswordHash = oldHash
                };

            _userRepositoryMock
                .Setup(x =>
                    x.GetUserByIdAsync(1))
                .ReturnsAsync(user);

            var dto =
                new ChangePasswordDto
                {
                    CurrentPassword = "old123",
                    NewPassword = "new123"
                };

            // ACT

            await _service.ChangePasswordAsync(
                1,
                dto);

            // ASSERT

            user.PasswordHash
                .Should().NotBe(oldHash);

            BCrypt.Net.BCrypt.Verify(
                "new123",
                user.PasswordHash)
                .Should().BeTrue();

            _userRepositoryMock.Verify(
                x => x.UpdateUserAsync(user),
                Times.Once);
        }
    }
}