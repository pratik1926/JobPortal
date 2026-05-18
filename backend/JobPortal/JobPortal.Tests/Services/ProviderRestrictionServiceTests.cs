using FluentAssertions;
using JobPortal.Application.DTOs.Moderation;
using JobPortal.Application.Interfaces.Moderation;
using JobPortal.Application.Interfaces.Reports;
using JobPortal.Application.Interfaces.Users;
using JobPortal.Application.Services;
using JobPortal.Domain.Entities;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace JobPortal.Tests.Services
{
    public class ProviderRestrictionServiceTests
    {
        private readonly Mock<IProviderRestrictionRepository>
            _repositoryMock;

        private readonly Mock<IReportRepository>
            _reportRepositoryMock;

        private readonly Mock<IUserRepository>
            _userRepositoryMock;

        private readonly Mock<ILogger<ProviderRestrictionService>>
            _loggerMock;

        private readonly ProviderRestrictionService
            _service;

        public ProviderRestrictionServiceTests()
        {
            _repositoryMock =
                new Mock<IProviderRestrictionRepository>();

            _reportRepositoryMock =
                new Mock<IReportRepository>();

            _userRepositoryMock =
                new Mock<IUserRepository>();

            _loggerMock =
                new Mock<ILogger<ProviderRestrictionService>>();

            _service =
                new ProviderRestrictionService(
                    _repositoryMock.Object,
                    _reportRepositoryMock.Object,
                    _userRepositoryMock.Object,
                    _loggerMock.Object
                );
        }

        [Fact]
        public async Task
CreateRestrictionAsync_Should_Create_New_Restriction()
        {
            // ARRANGE

            var dto =
                new CreateProviderRestrictionDto
                {
                    ProviderId = 1,
                    SeekerId = 2,
                    ReportId = 10
                };

            _userRepositoryMock
                .Setup(x =>
                    x.GetUserByIdAsync(1))
                .ReturnsAsync(
                    new User
                    {
                        Id = 1,
                        Role = "Provider"
                    });

            _userRepositoryMock
                .Setup(x =>
                    x.GetUserByIdAsync(2))
                .ReturnsAsync(
                    new User
                    {
                        Id = 2,
                        Role = "Seeker"
                    });

            _repositoryMock
                .Setup(x =>
                    x.GetByProviderAndSeekerAsync(1, 2))
                .ReturnsAsync(
                    (ProviderRestriction?)null);

            _repositoryMock
                .Setup(x =>
                    x.CreateAsync(
                        It.IsAny<ProviderRestriction>()))
                .ReturnsAsync(
                    new ProviderRestriction
                    {
                        Id = 100,
                        ProviderId = 1,
                        SeekerId = 2,
                        ReportId = 10,
                        CreatedAtUtc = DateTime.UtcNow
                    });

            // ACT

            var result =
                await _service
                    .CreateRestrictionAsync(
                        dto,
                        999);

            // ASSERT

            result.Should().NotBeNull();

            result.ProviderId
                .Should().Be(1);

            result.SeekerId
                .Should().Be(2);

            result.ReportId
                .Should().Be(10);
        }

        [Fact]
        public async Task
CreateRestrictionAsync_Should_Throw_When_Provider_Not_Found()
        {
            // ARRANGE

            var dto =
                new CreateProviderRestrictionDto
                {
                    ProviderId = 1,
                    SeekerId = 2
                };

            _userRepositoryMock
                .Setup(x =>
                    x.GetUserByIdAsync(1))
                .ReturnsAsync(
                    (User?)null);

            // ACT

            Func<Task> act = async () =>
                await _service
                    .CreateRestrictionAsync(
                        dto,
                        1);

            // ASSERT

            await act.Should()
                .ThrowAsync<InvalidOperationException>()
                .WithMessage(
                    "Provider not found");
        }

        [Fact]
        public async Task
CreateRestrictionAsync_Should_Return_Existing_Restriction()
        {
            // ARRANGE

            var dto =
                new CreateProviderRestrictionDto
                {
                    ProviderId = 1,
                    SeekerId = 2,
                    ReportId = 10
                };

            _userRepositoryMock
                .Setup(x =>
                    x.GetUserByIdAsync(1))
                .ReturnsAsync(
                    new User
                    {
                        Id = 1,
                        Role = "Provider"
                    });

            _userRepositoryMock
                .Setup(x =>
                    x.GetUserByIdAsync(2))
                .ReturnsAsync(
                    new User
                    {
                        Id = 2,
                        Role = "Seeker"
                    });

            _repositoryMock
                .Setup(x =>
                    x.GetByProviderAndSeekerAsync(1, 2))
                .ReturnsAsync(
                    new ProviderRestriction
                    {
                        Id = 50,
                        ProviderId = 1,
                        SeekerId = 2,
                        ReportId = 10,
                        CreatedAtUtc = DateTime.UtcNow
                    });

            // ACT

            var result =
                await _service
                    .CreateRestrictionAsync(
                        dto,
                        1);

            // ASSERT

            result.Should().NotBeNull();

            result.Id
                .Should().Be(50);

            _repositoryMock.Verify(
                x => x.CreateAsync(
                    It.IsAny<ProviderRestriction>()),
                Times.Never);
        }

        [Fact]
        public async Task
IsSeekerRestrictedForProviderAsync_Should_Return_True()
        {
            // ARRANGE

            _repositoryMock
                .Setup(x =>
                    x.ExistsAsync(1, 2))
                .ReturnsAsync(true);

            // ACT

            var result =
                await _service
                    .IsSeekerRestrictedForProviderAsync(
                        2,
                        1);

            // ASSERT

            result.Should().BeTrue();
        }
    }
}