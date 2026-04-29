public interface INotificationSender
{
    Task SendAsync(int userId, object payload);
}