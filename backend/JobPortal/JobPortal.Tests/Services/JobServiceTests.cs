using FluentAssertions;
using JobPortal.Application.DTOs.Jobs;
using JobPortal.Application.Exceptions;
using JobPortal.Application.Interfaces.Jobs;
using JobPortal.Application.Interfaces.Moderation;
using JobPortal.Application.Services;
using JobPortal.Domain.Entities;
using Moq;
using Xunit;

namespace JobPortal.Tests.Services
{
    public class JobServiceTests
    {
        private readonly Mock<IJobRepository>
            _jobRepositoryMock;

        private readonly Mock<IProviderRestrictionService>
            _restrictionServiceMock;

        private readonly JobService
            _service;

        public JobServiceTests()
        {
            _jobRepositoryMock =
                new Mock<IJobRepository>();

            _restrictionServiceMock =
                new Mock<IProviderRestrictionService>();

            _service =
                new JobService(
                    _jobRepositoryMock.Object,
                    _restrictionServiceMock.Object
                );
        }

        [Fact]
        public async Task
CreateJobAsync_Should_Throw_When_Dto_Is_Null()
        {
            // ACT

            Func<Task> act = async () =>
                await _service.CreateJobAsync(
                    null!,
                    1);

            // ASSERT

            await act.Should()
                .ThrowAsync<BadRequestException>()
                .WithMessage("Invalid job data");
        }

        [Fact]
        public async Task
CreateJobAsync_Should_Create_Job()
        {
            // ARRANGE

            var dto =
                new CreateJobDto
                {
                    Title = "React Developer",
                    Description = "Frontend role",
                    Budget = 1000,
                    Location = "Kathmandu",
                    Skills = "React,.NET"
                };

            // ACT

            await _service.CreateJobAsync(dto, 5);

            // ASSERT

            _jobRepositoryMock.Verify(
                x => x.CreateJobAsync(
                    It.Is<Job>(j =>
                        j.Title == dto.Title &&
                        j.ProviderId == 5)),
                Times.Once);
        }

        [Fact]
        public async Task
UpdateJobAsync_Should_Throw_When_Job_Not_Found()
        {
            // ARRANGE

            _jobRepositoryMock
                .Setup(x =>
                    x.GetJobByIdAsync(1))
                .ReturnsAsync((Job?)null);

            var dto =
                new UpdateJobDto();

            // ACT

            Func<Task> act = async () =>
                await _service.UpdateJobAsync(
                    1,
                    dto,
                    10);

            // ASSERT

            await act.Should()
                .ThrowAsync<Exception>()
                .WithMessage("Job not found");
        }

        [Fact]
        public async Task
UpdateJobAsync_Should_Throw_When_Not_Owner()
        {
            // ARRANGE

            var job =
                new Job
                {
                    Id = 1,
                    ProviderId = 5
                };

            _jobRepositoryMock
                .Setup(x =>
                    x.GetJobByIdAsync(1))
                .ReturnsAsync(job);

            var dto =
                new UpdateJobDto();

            // ACT

            Func<Task> act = async () =>
                await _service.UpdateJobAsync(
                    1,
                    dto,
                    10);

            // ASSERT

            await act.Should()
                .ThrowAsync<UnauthorizedAccessException>()
                .WithMessage(
                    "You can only edit your own jobs");
        }

        [Fact]
        public async Task
DeleteJobAsync_Should_Throw_When_Not_Owner()
        {
            // ARRANGE

            var job =
                new Job
                {
                    Id = 1,
                    ProviderId = 5
                };

            _jobRepositoryMock
                .Setup(x =>
                    x.GetJobByIdAsync(1))
                .ReturnsAsync(job);

            // ACT

            Func<Task> act = async () =>
                await _service.DeleteJobAsync(
                    1,
                    10);

            // ASSERT

            await act.Should()
                .ThrowAsync<UnauthorizedAccessException>()
                .WithMessage(
                    "You can only delete your own jobs");
        }

        [Fact]
        public async Task
GetAllJobsAsync_Should_Filter_Restricted_Providers()
        {
            // ARRANGE

            var jobs =
                new List<Job>
                {
                    new Job
                    {
                        Id = 1,
                        ProviderId = 100,
                        Title = "Allowed Job"
                    },
                    new Job
                    {
                        Id = 2,
                        ProviderId = 200,
                        Title = "Restricted Job"
                    }
                };

            _jobRepositoryMock
                .Setup(x =>
                    x.GetAllJobsAsync())
                .ReturnsAsync(jobs);

            _restrictionServiceMock
                .Setup(x =>
                    x.GetRestrictedProviderIdsForSeekerAsync(10))
                .ReturnsAsync(new List<int> { 200 });

            // ACT

            var result =
                await _service.GetAllJobsAsync(10);

            // ASSERT

            result.Should().HaveCount(1);

            result.First().Title
                .Should().Be("Allowed Job");
        }

        [Fact]
        public async Task
GetJobByIdAsync_Should_Throw_When_Restricted()
        {
            // ARRANGE

            var job =
                new Job
                {
                    Id = 1,
                    ProviderId = 200
                };

            _jobRepositoryMock
                .Setup(x =>
                    x.GetJobByIdAsync(1))
                .ReturnsAsync(job);

            _restrictionServiceMock
                .Setup(x =>
                    x.IsSeekerRestrictedForProviderAsync(
                        10,
                        200))
                .ReturnsAsync(true);

            // ACT

            Func<Task> act = async () =>
                await _service.GetJobByIdAsync(
                    1,
                    10);

            // ASSERT

            await act.Should()
                .ThrowAsync<UnauthorizedAccessException>()
                .WithMessage(
                    "You are restricted from interacting with this provider.");
        }

        [Fact]
        public async Task
BulkCreateAsync_Should_Return_Success_And_Failure()
        {
            // ARRANGE

            var jobs =
                new List<CreateJobDto>
                {
                    new CreateJobDto
                    {
                        Title = "Valid Job",
                        Budget = 100,
                        Description = "Desc",
                        Location = "Nepal"
                    },

                    new CreateJobDto
                    {
                        Title = "",
                        Budget = 0
                    }
                };

            // ACT

            var result =
                await _service.BulkCreateAsync(
                    jobs,
                    5);

            // ASSERT

            result.Should().HaveCount(2);

            result[0].Status
                .Should().Be("Success");

            result[1].Status
                .Should().Be("Failed");
        }
    }
}