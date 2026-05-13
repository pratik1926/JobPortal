using FluentAssertions;
using JobPortal.Application.Interfaces;
using JobPortal.Application.Services;
using JobPortal.Domain.Entities;
using Moq;
using Xunit;

namespace JobPortal.Tests.Services
{
    public class AdminServiceTests
    {
        private readonly Mock<IUserRepository>
            _userRepositoryMock;

        private readonly Mock<IJobRepository>
            _jobRepositoryMock;

        private readonly Mock<IReportRepository>
            _reportRepositoryMock;

        private readonly AdminService
            _adminService;

        public AdminServiceTests()
        {
            _userRepositoryMock =
                new Mock<IUserRepository>();

            _jobRepositoryMock =
                new Mock<IJobRepository>();

            _reportRepositoryMock =
                new Mock<IReportRepository>();

            _adminService =
                new AdminService(
                    _userRepositoryMock.Object,
                    _jobRepositoryMock.Object,
                    _reportRepositoryMock.Object
                );
        }

        [Fact]
        public async Task
Should_Return_Correct_Analytics_Data()
        {
            // ARRANGE

            var users =
                new List<User>
                {
                    new User
                    {
                        Id = 1,
                        Name = "Pratik",
                        Role = "Provider",
                        IsBanned = false
                    },

                    new User
                    {
                        Id = 2,
                        Name = "John",
                        Role = "Seeker",
                        IsBanned = true
                    }
                };

            var jobs =
                new List<Job>
                {
                    new Job
                    {
                        Id = 1,
                        Title = "React Developer",
                        ProviderId = 1,
                        CreatedAt = DateTime.UtcNow
                    }
                };

            var reports =
                new List<Report>
                {
                    new Report
                    {
                        Id = 1,
                        Status = "Pending",
                        Reason = "Spam",
                        CreatedAt = DateTime.UtcNow
                    },

                    new Report
                    {
                        Id = 2,
                        Status = "Resolved",
                        Reason = "Abuse",
                        CreatedAt = DateTime.UtcNow
                    }
                };

            _userRepositoryMock
                .Setup(x =>
                    x.GetAllUsersAsync())
                .ReturnsAsync(users);

            _jobRepositoryMock
                .Setup(x =>
                    x.GetAllJobsAsync())
                .ReturnsAsync(jobs);

            _reportRepositoryMock
                .Setup(x =>
                    x.GetAllReportsAsync())
                .ReturnsAsync(reports);

            // ACT

            var result =
                await _adminService
                    .GetAnalyticsAsync();

            // ASSERT

            result.Should().NotBeNull();
        }
    }
}