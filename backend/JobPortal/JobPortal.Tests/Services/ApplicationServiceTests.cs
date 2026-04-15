using Xunit;
using Moq;
using FluentAssertions;
using JobPortal.Application.Services;
using JobPortal.Application.Interfaces;
using JobPortal.Domain.Entities;
using ApplicationEntity = JobPortal.Domain.Entities.Application;

namespace JobPortal.Tests.Services
{
    public class ApplicationServiceTests
    {
        private readonly Mock<IApplicationRepository> _repoMock;
        private readonly ApplicationService _service;

        public ApplicationServiceTests()
        {
            _repoMock = new Mock<IApplicationRepository>();
            _service = new ApplicationService(_repoMock.Object);
        }

        // ✅ APPLY SUCCESS
        [Fact]
        public async Task ApplyToJobAsync_ShouldApply_WhenNotDuplicate()
        {
            int jobId = 1;
            int seekerId = 2;

            _repoMock
                .Setup(r => r.ExistsAsync(jobId, seekerId))
                .ReturnsAsync(false);

            await _service.ApplyToJobAsync(jobId, seekerId);

            _repoMock.Verify(r => r.ApplyAsync(It.Is<ApplicationEntity>(a =>
                a.JobId == jobId &&
                a.SeekerId == seekerId
            )), Times.Once);
        }

        // ❌ DUPLICATE APPLY
        [Fact]
        public async Task ApplyToJobAsync_ShouldThrow_WhenDuplicate()
        {
            int jobId = 1;
            int seekerId = 2;

            _repoMock
                .Setup(r => r.ExistsAsync(jobId, seekerId))
                .ReturnsAsync(true);

            Func<Task> act = async () =>
                await _service.ApplyToJobAsync(jobId, seekerId);

            await act.Should().ThrowAsync<Exception>();

            _repoMock.Verify(r => r.ApplyAsync(It.IsAny<ApplicationEntity>()), Times.Never);
        }

        // ❌ NOT OWNER
        [Fact]
        public async Task UpdateApplicationStatusAsync_ShouldThrow_WhenProviderNotOwner()
        {
            int applicationId = 1;
            int providerId = 10;

            var application = new ApplicationEntity
            {
                Id = applicationId,
                Job = new Job
                {
                    ProviderId = 99 // actual owner
                }
            };

            _repoMock
                .Setup(r => r.GetByIdAsync(applicationId))
                .ReturnsAsync(application);

            Func<Task> act = async () =>
                await _service.UpdateApplicationStatusAsync(applicationId, "Accepted", providerId);

            await act.Should().ThrowAsync<UnauthorizedAccessException>();

            _repoMock.Verify(r => r.UpdateAsync(It.IsAny<ApplicationEntity>()), Times.Never);
        }

        // ✅ OWNER SUCCESS
        [Fact]
        public async Task UpdateApplicationStatusAsync_ShouldUpdate_WhenProviderIsOwner()
        {
            int applicationId = 1;
            int providerId = 10;

            var application = new ApplicationEntity
            {
                Id = applicationId,
                Job = new Job
                {
                    ProviderId = providerId
                }
            };

            _repoMock
                .Setup(r => r.GetByIdAsync(applicationId))
                .ReturnsAsync(application);

            await _service.UpdateApplicationStatusAsync(applicationId, "Accepted", providerId);

            _repoMock.Verify(r => r.UpdateAsync(It.Is<ApplicationEntity>(a =>
                a.Status == "Accepted"
            )), Times.Once);
        }
    }
}