public interface INotificationService
{
    Task CreateAsync(CreateNotificationDto dto);
    Task<List<NotificationDto>> GetUserNotifications(int userId);
    Task MarkAsRead(int id);
    Task MarkAllAsRead(int userId);
}