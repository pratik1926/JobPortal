using FluentAssertions;
using JobPortal.Application.Interfaces;
using JobPortal.Application.Services;
using JobPortal.Domain.Entities;
using Moq;
using Xunit;

namespace JobPortal.Tests.Services
{
    public class VerificationServiceTests
    {
        private readonly Mock<IEmailService>
            _emailServiceMock;

        private readonly Mock<IEmailVerificationRepository>
            _repositoryMock;

        private readonly VerificationService
            _service;

        public VerificationServiceTests()
        {
            _emailServiceMock =
                new Mock<IEmailService>();

            _repositoryMock =
                new Mock<IEmailVerificationRepository>();

            _service =
                new VerificationService(
                    _emailServiceMock.Object,
                    _repositoryMock.Object
                );
        }

        [Fact]
        public async Task
SendCodeAsync_Should_Remove_Old_Codes()
        {
            // ACT

            await _service.SendCodeAsync(
                "test@gmail.com");

            // ASSERT

            _repositoryMock.Verify(
                x => x.RemoveByEmailAsync(
                    "test@gmail.com"),
                Times.Once);
        }

        [Fact]
        public async Task
SendCodeAsync_Should_Save_And_Send_Email()
        {
            // ACT

            await _service.SendCodeAsync(
                "test@gmail.com");

            // ASSERT

            _repositoryMock.Verify(
                x => x.AddAsync(
                    It.IsAny<EmailVerification>()),
                Times.Once);

            _repositoryMock.Verify(
                x => x.SaveChangesAsync(),
                Times.Once);

            _emailServiceMock.Verify(
                x => x.SendTemplateAsync(
                    "test@gmail.com",
                    "test@gmail.com",
                    "Your Verification Code",
                    "OtpVerification",
                    It.IsAny<object>(),
                    It.IsAny<CancellationToken>()),
                Times.Once);
        }

        [Fact]
        public async Task
VerifyCodeAsync_Should_Return_False_When_NotFound()
        {
            // ARRANGE

            _repositoryMock
                .Setup(x =>
                    x.GetLatestByEmailAsync(
                        "test@gmail.com"))
                .ReturnsAsync(
                    (EmailVerification?)null);

            // ACT

            var result =
                await _service.VerifyCodeAsync(
                    "test@gmail.com",
                    "123456");

            // ASSERT

            result.Should().BeFalse();
        }

        [Fact]
        public async Task
VerifyCodeAsync_Should_Return_False_When_Expired()
        {
            // ARRANGE

            var record =
                new EmailVerification
                {
                    Code = "123456",
                    Expiry =
                        DateTime.UtcNow.AddMinutes(-1)
                };

            _repositoryMock
                .Setup(x =>
                    x.GetLatestByEmailAsync(
                        "test@gmail.com"))
                .ReturnsAsync(record);

            // ACT

            var result =
                await _service.VerifyCodeAsync(
                    "test@gmail.com",
                    "123456");

            // ASSERT

            result.Should().BeFalse();
        }

        [Fact]
        public async Task
VerifyCodeAsync_Should_Return_False_When_Code_Invalid()
        {
            // ARRANGE

            var record =
                new EmailVerification
                {
                    Code = "999999",
                    Expiry =
                        DateTime.UtcNow.AddMinutes(5)
                };

            _repositoryMock
                .Setup(x =>
                    x.GetLatestByEmailAsync(
                        "test@gmail.com"))
                .ReturnsAsync(record);

            // ACT

            var result =
                await _service.VerifyCodeAsync(
                    "test@gmail.com",
                    "123456");

            // ASSERT

            result.Should().BeFalse();
        }

        [Fact]
        public async Task
VerifyCodeAsync_Should_Verify_Successfully()
        {
            // ARRANGE

            var record =
                new EmailVerification
                {
                    Code = "123456",
                    Expiry =
                        DateTime.UtcNow.AddMinutes(5),
                    IsVerified = false
                };

            _repositoryMock
                .Setup(x =>
                    x.GetLatestByEmailAsync(
                        "test@gmail.com"))
                .ReturnsAsync(record);

            // ACT

            var result =
                await _service.VerifyCodeAsync(
                    "test@gmail.com",
                    "123456");

            // ASSERT

            result.Should().BeTrue();

            record.IsVerified
                .Should().BeTrue();

            _repositoryMock.Verify(
                x => x.SaveChangesAsync(),
                Times.Once);
        }
    }
}