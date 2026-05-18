using FluentAssertions;
using JobPortal.Application.DTOs.Reports;
using JobPortal.Application.Interfaces.Jobs;
using JobPortal.Application.Interfaces.Reports;
using JobPortal.Application.Interfaces.Users;
using JobPortal.Application.Services;
using JobPortal.Domain.Entities;
using Moq;
using Xunit;

using ApplicationEntity =
    JobPortal.Domain.Entities.Application;

namespace JobPortal.Tests.Services
{
    public class ReportServiceTests
    {
        private readonly Mock<IReportRepository>
            _reportRepositoryMock;

        private readonly Mock<IJobRepository>
            _jobRepositoryMock;

        private readonly Mock<IUserRepository>
            _userRepositoryMock;

        private readonly Mock<INotificationService>
            _notificationServiceMock;

        private readonly ReportService
            _service;

        public ReportServiceTests()
        {
            _reportRepositoryMock =
                new Mock<IReportRepository>();

            _jobRepositoryMock =
                new Mock<IJobRepository>();

            _userRepositoryMock =
                new Mock<IUserRepository>();

            _notificationServiceMock =
                new Mock<INotificationService>();

            _service =
                new ReportService(
                    _reportRepositoryMock.Object,
                    _jobRepositoryMock.Object,
                    _userRepositoryMock.Object,
                    _notificationServiceMock.Object
                );
        }

        [Fact]
        public async Task
CreateReportAsync_Should_Throw_When_Application_Not_Found()
        {
            // ARRANGE

            var dto =
                new CreateReportDto
                {
                    ApplicationId = 1
                };

            _jobRepositoryMock
                .Setup(x =>
                    x.GetApplicationByIdAsync(1))
                .ReturnsAsync(
                    (ApplicationEntity?)null);

            // ACT

            Func<Task> act = async () =>
                await _service.CreateReportAsync(
                    10,
                    dto);

            // ASSERT

            await act.Should()
                .ThrowAsync<ArgumentException>()
                .WithMessage("Application not found");
        }

        [Fact]
        public async Task
CreateReportAsync_Should_Throw_When_Not_Provider_Owner()
        {
            // ARRANGE

            var application =
                new ApplicationEntity
                {
                    Id = 1,
                    Status = "Approved",
                    Job = new Job
                    {
                        ProviderId = 99
                    }
                };

            var dto =
                new CreateReportDto
                {
                    ApplicationId = 1
                };

            _jobRepositoryMock
                .Setup(x =>
                    x.GetApplicationByIdAsync(1))
                .ReturnsAsync(application);

            // ACT

            Func<Task> act = async () =>
                await _service.CreateReportAsync(
                    10,
                    dto);

            // ASSERT

            await act.Should()
                .ThrowAsync<UnauthorizedAccessException>()
                .WithMessage(
                    "You can only report users who applied to your job");
        }

        [Fact]
        public async Task
CreateReportAsync_Should_Throw_When_Application_Not_Approved()
        {
            // ARRANGE

            var application =
                new ApplicationEntity
                {
                    Id = 1,
                    Status = "Pending",
                    Job = new Job
                    {
                        ProviderId = 10
                    }
                };

            var dto =
                new CreateReportDto
                {
                    ApplicationId = 1
                };

            _jobRepositoryMock
                .Setup(x =>
                    x.GetApplicationByIdAsync(1))
                .ReturnsAsync(application);

            // ACT

            Func<Task> act = async () =>
                await _service.CreateReportAsync(
                    10,
                    dto);

            // ASSERT

            await act.Should()
                .ThrowAsync<InvalidOperationException>()
                .WithMessage(
                    "Only approved applications can be reported");
        }

        [Fact]
        public async Task
CreateReportAsync_Should_Throw_When_Duplicate_Report()
        {
            // ARRANGE

            var application =
                new ApplicationEntity
                {
                    Id = 1,
                    Status = "Approved",
                    Job = new Job
                    {
                        ProviderId = 10
                    }
                };

            var dto =
                new CreateReportDto
                {
                    ApplicationId = 1
                };

            _jobRepositoryMock
                .Setup(x =>
                    x.GetApplicationByIdAsync(1))
                .ReturnsAsync(application);

            _reportRepositoryMock
                .Setup(x =>
                    x.ReportExistsForApplicationByReporterAsync(
                        1,
                        10))
                .ReturnsAsync(true);

            // ACT

            Func<Task> act = async () =>
                await _service.CreateReportAsync(
                    10,
                    dto);

            // ASSERT

            await act.Should()
                .ThrowAsync<InvalidOperationException>()
                .WithMessage(
                    "You have already reported this application");
        }

        [Fact]
        public async Task
CreateReportAsync_Should_Create_Report_And_Notify_Admins()
        {
            // ARRANGE

            var application =
                new ApplicationEntity
                {
                    Id = 1,
                    Status = "Approved",
                    SeekerId = 20,
                    JobId = 100,
                    Job = new Job
                    {
                        ProviderId = 10,
                        Title = "React Developer"
                    }
                };

            var dto =
                new CreateReportDto
                {
                    ApplicationId = 1,
                    Reason = "Fraud",
                    Details = "Fake information"
                };

            var admins =
                new List<User>
                {
                    new User { Id = 1 },
                    new User { Id = 2 }
                };

            _jobRepositoryMock
                .Setup(x =>
                    x.GetApplicationByIdAsync(1))
                .ReturnsAsync(application);

            _reportRepositoryMock
                .Setup(x =>
                    x.ReportExistsForApplicationByReporterAsync(
                        1,
                        10))
                .ReturnsAsync(false);

            _userRepositoryMock
                .Setup(x =>
                    x.GetAdminsAsync())
                .ReturnsAsync(admins);

            _reportRepositoryMock
                .Setup(x =>
                    x.CreateReportAsync(
                        It.IsAny<Report>()))
                .ReturnsAsync(
                    (Report r) => r);

            // ACT

            var result =
                await _service.CreateReportAsync(
                    10,
                    dto);

            // ASSERT

            result.Should().NotBeNull();

            result.Reason
                .Should().Be("Fraud");

            _reportRepositoryMock.Verify(
                x => x.CreateReportAsync(
                    It.IsAny<Report>()),
                Times.Once);

            _notificationServiceMock.Verify(
                x => x.CreateAsync(
                    It.IsAny<CreateNotificationDto>()),
                Times.Exactly(2));
        }

        [Fact]
        public async Task
ReviewReportAsync_Should_Throw_When_NotFound()
        {
            // ARRANGE

            _reportRepositoryMock
                .Setup(x =>
                    x.GetReportByIdAsync(1))
                .ReturnsAsync((Report?)null);

            // ACT

            Func<Task> act = async () =>
                await _service.ReviewReportAsync(
                    1,
                    99,
                    new UpdateReportStatusDto());

            // ASSERT

            await act.Should()
                .ThrowAsync<ArgumentException>()
                .WithMessage("Report not found");
        }

        [Fact]
        public async Task
ReviewReportAsync_Should_Throw_When_Already_Resolved()
        {
            // ARRANGE

            var report =
                new Report
                {
                    Id = 1,
                    IsResolved = true
                };

            _reportRepositoryMock
                .Setup(x =>
                    x.GetReportByIdAsync(1))
                .ReturnsAsync(report);

            // ACT

            Func<Task> act = async () =>
                await _service.ReviewReportAsync(
                    1,
                    99,
                    new UpdateReportStatusDto());

            // ASSERT

            await act.Should()
                .ThrowAsync<InvalidOperationException>()
                .WithMessage(
                    "Report already resolved");
        }

        [Fact]
        public async Task
ReviewReportAsync_Should_Update_Report()
        {
            // ARRANGE

            var report =
                new Report
                {
                    Id = 1,
                    IsResolved = false
                };

            _reportRepositoryMock
                .Setup(x =>
                    x.GetReportByIdAsync(1))
                .ReturnsAsync(report);

            _reportRepositoryMock
                .Setup(x =>
                    x.UpdateReportAsync(report))
                .ReturnsAsync(true);

            // ACT

            var result =
                await _service.ReviewReportAsync(
                    1,
                    99,
                    new UpdateReportStatusDto
                    {
                        AdminNotes = "Under review"
                    });

            // ASSERT

            result.Should().BeTrue();

            report.Status
                .Should().Be("Reviewed");

            report.AdminNotes
                .Should().Be("Under review");
        }

        [Fact]
        public async Task
RejectReportAsync_Should_Resolve_Report()
        {
            // ARRANGE

            var report =
                new Report
                {
                    Id = 1,
                    IsResolved = false
                };

            _reportRepositoryMock
                .Setup(x =>
                    x.GetReportByIdAsync(1))
                .ReturnsAsync(report);

            _reportRepositoryMock
                .Setup(x =>
                    x.UpdateReportAsync(report))
                .ReturnsAsync(true);

            // ACT

            await _service.RejectReportAsync(
                1,
                99,
                new UpdateReportStatusDto());

            // ASSERT

            report.Status
                .Should().Be("Rejected");

            report.IsResolved
                .Should().BeTrue();
        }

        [Fact]
        public async Task
ResolveReportAsync_Should_Set_ActionTaken_Status()
        {
            // ARRANGE

            var report =
                new Report
                {
                    Id = 1,
                    IsResolved = false
                };

            _reportRepositoryMock
                .Setup(x =>
                    x.GetReportByIdAsync(1))
                .ReturnsAsync(report);

            _reportRepositoryMock
                .Setup(x =>
                    x.UpdateReportAsync(report))
                .ReturnsAsync(true);

            // ACT

            await _service.ResolveReportAsync(
                1,
                99,
                new UpdateReportStatusDto());

            // ASSERT

            report.Status
                .Should().Be("ActionTaken");

            report.IsResolved
                .Should().BeTrue();
        }
    }
}