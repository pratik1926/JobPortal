using FluentAssertions;
using JobPortal.Application.DTOs;
using JobPortal.Application.DTOs.Email;
using JobPortal.Application.Exceptions;
using JobPortal.Application.Interfaces.Email;
using JobPortal.Application.Interfaces.Files;
using JobPortal.Application.Interfaces.Jobs;
using JobPortal.Application.Interfaces.Moderation;
using JobPortal.Application.Interfaces.Users;
using JobPortal.Application.Services;
using JobPortal.Domain.Entities;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

using ApplicationEntity =
    JobPortal.Domain.Entities.Application;

namespace JobPortal.Tests.Services
{
    public class ApplicationServiceTests
    {
        private readonly Mock<IJobRepository>
            _jobRepositoryMock;

        private readonly Mock<IFileService>
            _fileServiceMock;

        private readonly Mock<INotificationService>
            _notificationServiceMock;

        private readonly Mock<IUserRepository>
            _userRepositoryMock;

        private readonly Mock<IEmailService>
            _emailServiceMock;

        private readonly Mock<IEmailTemplateRenderer>
            _templateRendererMock;

        private readonly Mock<IProviderRestrictionService>
            _restrictionServiceMock;

        private readonly Mock<ILogger<ApplicationService>>
            _loggerMock;

        private readonly Mock<IResumeReaderService>
            _resumeReaderServiceMock;

        private readonly ApplicationService
            _service;

        public ApplicationServiceTests()
        {
            _jobRepositoryMock =
                new Mock<IJobRepository>();

            _fileServiceMock =
                new Mock<IFileService>();

            _notificationServiceMock =
                new Mock<INotificationService>();

            _userRepositoryMock =
                new Mock<IUserRepository>();

            _emailServiceMock =
                new Mock<IEmailService>();

            _templateRendererMock =
                new Mock<IEmailTemplateRenderer>();

            _restrictionServiceMock =
                new Mock<IProviderRestrictionService>();

            _loggerMock =
                new Mock<ILogger<ApplicationService>>();

            _resumeReaderServiceMock =
                new Mock<IResumeReaderService>();

            _service =
                new ApplicationService(
                    _jobRepositoryMock.Object,
                    _fileServiceMock.Object,
                    _notificationServiceMock.Object,
                    _userRepositoryMock.Object,
                    _emailServiceMock.Object,
                    _templateRendererMock.Object,
                    _restrictionServiceMock.Object,
                    _loggerMock.Object,
                    _resumeReaderServiceMock.Object
                );
        }

        [Fact]
        public async Task
ApplyToJobAsync_Should_Throw_When_Job_Not_Found()
        {
            // ARRANGE

            var dto =
                new ApplyJobDto
                {
                    FileName = "resume.pdf",
                    Resume = new byte[] { 1, 2, 3 }
                };

            _jobRepositoryMock
                .Setup(x =>
                    x.GetJobByIdAsync(1))
                .ReturnsAsync(
                    (Job?)null);

            // ACT

            Func<Task> act = async () =>
                await _service.ApplyToJobAsync(
                    1,
                    10,
                    dto);

            // ASSERT

            await act.Should()
                .ThrowAsync<NotFoundException>()
                .WithMessage("Job not found");
        }

        [Fact]
        public async Task
ApplyToJobAsync_Should_Throw_When_User_Is_Restricted()
        {
            // ARRANGE

            var job =
                new Job
                {
                    Id = 1,
                    ProviderId = 5,
                    Title = "React Developer"
                };

            var dto =
                new ApplyJobDto
                {
                    FileName = "resume.pdf",
                    Resume = new byte[] { 1, 2, 3 }
                };

            _jobRepositoryMock
                .Setup(x =>
                    x.GetJobByIdAsync(1))
                .ReturnsAsync(job);

            _restrictionServiceMock
                .Setup(x =>
                    x.IsSeekerRestrictedForProviderAsync(
                        10,
                        5))
                .ReturnsAsync(true);

            // ACT

            Func<Task> act = async () =>
                await _service.ApplyToJobAsync(
                    1,
                    10,
                    dto);

            // ASSERT

            await act.Should()
                .ThrowAsync<UnauthorizedAccessException>()
                .WithMessage(
                    "You are restricted from interacting with this provider.");
        }

        [Fact]
        public async Task
ApplyToJobAsync_Should_Throw_When_Already_Applied()
        {
            // ARRANGE

            var job =
                new Job
                {
                    Id = 1,
                    ProviderId = 5
                };

            var dto =
                new ApplyJobDto
                {
                    FileName = "resume.pdf",
                    Resume = new byte[] { 1, 2, 3 }
                };

            _jobRepositoryMock
                .Setup(x =>
                    x.GetJobByIdAsync(1))
                .ReturnsAsync(job);

            _restrictionServiceMock
                .Setup(x =>
                    x.IsSeekerRestrictedForProviderAsync(
                        10,
                        5))
                .ReturnsAsync(false);

            _jobRepositoryMock
                .Setup(x =>
                    x.HasUserApplied(1, 10))
                .ReturnsAsync(true);

            // ACT

            Func<Task> act = async () =>
                await _service.ApplyToJobAsync(
                    1,
                    10,
                    dto);

            // ASSERT

            await act.Should()
                .ThrowAsync<BadRequestException>()
                .WithMessage(
                    "You have already applied to this job");
        }

        [Fact]
        public async Task
ApplyToJobAsync_Should_Apply_Successfully()
        {
            // ARRANGE

            var job =
                new Job
                {
                    Id = 1,
                    ProviderId = 5,
                    Title = "React Developer"
                };

            var seeker =
                new User
                {
                    Id = 10,
                    Name = "Pratik",
                    Email = "test@gmail.com"
                };

            var provider =
                new User
                {
                    Id = 5,
                    Name = "Provider",
                    Email = "provider@gmail.com"
                };

            var dto =
                new ApplyJobDto
                {
                    FileName = "resume.pdf",
                    Resume = new byte[] { 1, 2, 3 },
                    CoverLetter = "I am interested",
                    Skills = new List<string>
                    {
                        "React",
                        ".NET"
                    }
                };

            _jobRepositoryMock
                .Setup(x =>
                    x.GetJobByIdAsync(1))
                .ReturnsAsync(job);

            _restrictionServiceMock
                .Setup(x =>
                    x.IsSeekerRestrictedForProviderAsync(
                        10,
                        5))
                .ReturnsAsync(false);

            _jobRepositoryMock
                .Setup(x =>
                    x.HasUserApplied(1, 10))
                .ReturnsAsync(false);

            _fileServiceMock
                .Setup(x =>
                    x.SaveResumeAsync(
                        dto.Resume,
                        dto.FileName))
                .ReturnsAsync(
                    "resume-url");

            _userRepositoryMock
                .Setup(x =>
                    x.GetUserByIdAsync(10))
                .ReturnsAsync(seeker);

            _userRepositoryMock
                .Setup(x =>
                    x.GetUserByIdAsync(5))
                .ReturnsAsync(provider);

            _templateRendererMock
                .Setup(x =>
                    x.RenderHtmlAsync(
                        It.IsAny<string>(),
                        It.IsAny<object>(),
                        It.IsAny<CancellationToken>()))
                .ReturnsAsync("<html>");

            _emailServiceMock
                .Setup(x =>
                    x.SendAsync(
                        It.IsAny<EmailMessageDto>(),
                        It.IsAny<CancellationToken>()))
                .ReturnsAsync(true);

            // ACT

            await _service.ApplyToJobAsync(
                1,
                10,
                dto);

            // ASSERT

            _jobRepositoryMock.Verify(
                x => x.ApplyToJobAsync(
                    It.IsAny<ApplicationEntity>()),
                Times.Once);

            _notificationServiceMock.Verify(
                x => x.CreateAsync(
                    It.IsAny<CreateNotificationDto>()),
                Times.Exactly(2));

            _emailServiceMock.Verify(
                x => x.SendAsync(
                    It.IsAny<EmailMessageDto>(),
                    It.IsAny<CancellationToken>()),
                Times.Once);
        }
    }
}