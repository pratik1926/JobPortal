using FluentAssertions;
using JobPortal.Application.Interfaces;
using JobPortal.Domain.Entities;
using Moq;
using Xunit;

namespace JobPortal.Tests.Services
{
    public class NotificationServiceTests
    {
        private readonly Mock<INotificationRepository>
            _repoMock;

        private readonly Mock<INotificationSender>
            _senderMock;

        private readonly NotificationService
            _service;

        public NotificationServiceTests()
        {
            _repoMock =
                new Mock<INotificationRepository>();

            _senderMock =
                new Mock<INotificationSender>();

            _service =
                new NotificationService(
                    _repoMock.Object,
                    _senderMock.Object
                );
        }

        [Fact]
        public async Task
CreateAsync_Should_Throw_When_Dto_Is_Null()
        {
            // ACT

            Func<Task> act = async () =>
                await _service.CreateAsync(null!);

            // ASSERT

            await act.Should()
                .ThrowAsync<ArgumentException>()
                .WithMessage("Invalid notification data");
        }

        [Fact]
        public async Task
CreateAsync_Should_Create_And_Send_Notification()
        {
            // ARRANGE

            var dto =
                new CreateNotificationDto
                {
                    UserId = 10,
                    Message = "New job application"
                };

            // ACT

            await _service.CreateAsync(dto);

            // ASSERT

            _repoMock.Verify(
                x => x.AddAsync(
                    It.Is<Notification>(n =>
                        n.UserId == dto.UserId &&
                        n.Message == dto.Message &&
                        n.IsRead == false)),
                Times.Once);

            _repoMock.Verify(
                x => x.SaveChangesAsync(),
                Times.Once);

            _senderMock.Verify(
                x => x.SendAsync(
                    dto.UserId,
                    It.IsAny<object>()),
                Times.Once);
        }

        [Fact]
        public async Task
GetUserNotifications_Should_Return_Ordered_Notifications()
        {
            // ARRANGE

            var notifications =
                new List<Notification>
                {
                    new Notification
                    {
                        Id = 1,
                        Message = "Old",
                        CreatedAt = DateTime.UtcNow.AddDays(-1)
                    },

                    new Notification
                    {
                        Id = 2,
                        Message = "Newest",
                        CreatedAt = DateTime.UtcNow
                    }
                };

            _repoMock
                .Setup(x =>
                    x.GetByUserIdAsync(10))
                .ReturnsAsync(notifications);

            // ACT

            var result =
                await _service
                    .GetUserNotifications(10);

            // ASSERT

            result.First().Message
                .Should().Be("Newest");

            result.Last().Message
                .Should().Be("Old");
        }

        [Fact]
        public async Task
MarkAsRead_Should_Throw_When_Notification_Not_Found()
        {
            // ARRANGE

            _repoMock
                .Setup(x =>
                    x.GetByIdAsync(1))
                .ReturnsAsync(
                    (Notification?)null);

            // ACT

            Func<Task> act = async () =>
                await _service.MarkAsRead(1);

            // ASSERT

            await act.Should()
                .ThrowAsync<Exception>()
                .WithMessage(
                    "Notification not found");
        }

        [Fact]
        public async Task
MarkAsRead_Should_Update_IsRead()
        {
            // ARRANGE

            var notification =
                new Notification
                {
                    Id = 1,
                    IsRead = false
                };

            _repoMock
                .Setup(x =>
                    x.GetByIdAsync(1))
                .ReturnsAsync(notification);

            // ACT

            await _service.MarkAsRead(1);

            // ASSERT

            notification.IsRead
                .Should().BeTrue();

            _repoMock.Verify(
                x => x.SaveChangesAsync(),
                Times.Once);
        }

        [Fact]
        public async Task
MarkAllAsRead_Should_Update_All_Unread()
        {
            // ARRANGE

            var notifications =
                new List<Notification>
                {
                    new Notification
                    {
                        Id = 1,
                        IsRead = false
                    },

                    new Notification
                    {
                        Id = 2,
                        IsRead = false
                    }
                };

            _repoMock
                .Setup(x =>
                    x.GetByUserIdAsync(10))
                .ReturnsAsync(notifications);

            // ACT

            await _service.MarkAllAsRead(10);

            // ASSERT

            notifications.All(n => n.IsRead)
                .Should().BeTrue();

            _repoMock.Verify(
                x => x.SaveChangesAsync(),
                Times.Once);
        }

        [Fact]
        public async Task
MarkAllAsRead_Should_Do_Nothing_When_All_Read()
        {
            // ARRANGE

            var notifications =
                new List<Notification>
                {
                    new Notification
                    {
                        Id = 1,
                        IsRead = true
                    }
                };

            _repoMock
                .Setup(x =>
                    x.GetByUserIdAsync(10))
                .ReturnsAsync(notifications);

            // ACT

            await _service.MarkAllAsRead(10);

            // ASSERT

            _repoMock.Verify(
                x => x.SaveChangesAsync(),
                Times.Never);
        }
    }
}