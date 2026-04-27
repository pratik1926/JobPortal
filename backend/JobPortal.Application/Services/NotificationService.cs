using JobPortal.Application.Interfaces;
using JobPortal.Domain.Entities;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _repo;

    public NotificationService(INotificationRepository repo)
    {
        _repo = repo;
    }

    // 🔔 CREATE NOTIFICATION
    public async Task CreateAsync(CreateNotificationDto dto)
    {
        if (dto == null)
            throw new ArgumentException("Invalid notification data");

        var notification = new Notification
        {
            UserId = dto.UserId,
            Message = dto.Message,
            CreatedAt = DateTime.UtcNow,
            IsRead = false
        };

        await _repo.AddAsync(notification);
        await _repo.SaveChangesAsync(); // 🔥 ensure saved
    }

    // 🔔 GET USER NOTIFICATIONS
    public async Task<List<NotificationDto>> GetUserNotifications(int userId)
    {
        var notifications = await _repo.GetByUserIdAsync(userId);

        return notifications
            .OrderByDescending(n => n.CreatedAt) // 🔥 latest first
            .Select(n => new NotificationDto
            {
                Id = n.Id,
                Message = n.Message,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            })
            .ToList();
    }

    // 🔔 MARK SINGLE AS READ
    public async Task MarkAsRead(int id)
    {
        var notification = await _repo.GetByIdAsync(id);

        if (notification == null)
            throw new Exception("Notification not found");

        if (!notification.IsRead)
        {
            notification.IsRead = true;
            await _repo.SaveChangesAsync();
        }
    }

    // 🔔 MARK ALL AS READ
    public async Task MarkAllAsRead(int userId)
    {
        var notifications = await _repo.GetByUserIdAsync(userId);

        var unreadNotifications = notifications.Where(n => !n.IsRead).ToList();

        if (!unreadNotifications.Any())
            return;

        foreach (var n in unreadNotifications)
        {
            n.IsRead = true;
        }

        await _repo.SaveChangesAsync();
    }
}