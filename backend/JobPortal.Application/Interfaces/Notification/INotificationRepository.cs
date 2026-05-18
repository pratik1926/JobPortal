using JobPortal.Domain.Entities;

public interface INotificationRepository
{
    Task AddAsync(Notification notification);
    Task<List<Notification>> GetByUserIdAsync(int userId);
    Task MarkAsReadAsync(int notificationId);
    Task<Notification?> GetByIdAsync(int id);
    Task SaveChangesAsync();
}