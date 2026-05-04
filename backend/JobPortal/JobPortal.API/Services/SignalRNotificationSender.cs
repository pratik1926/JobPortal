//using Microsoft.AspNetCore.SignalR;
//using JobPortal.API.Hubs;

//namespace JobPortal.API.Services
//{
//    public class SignalRNotificationSender
//    {
//        private readonly IHubContext<NotificationHub> _hubContext;

//        public SignalRNotificationSender(IHubContext<NotificationHub> hubContext)
//        {
//            _hubContext = hubContext;
//        }

//        public async Task SendAsync(int userId, object payload)
//        {
//            await _hubContext.Clients.User(userId.ToString())
//                .SendAsync("ReceiveNotification", payload);
//        }
//    }
//}

using Microsoft.AspNetCore.SignalR;
using JobPortal.API.Hubs;
using JobPortal.Application.Interfaces; // 🔥 IMPORTANT

namespace JobPortal.API.Services
{
    public class SignalRNotificationSender : INotificationSender // 🔥 IMPLEMENT INTERFACE
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public SignalRNotificationSender(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task SendAsync(int userId, object payload)
        {

            Console.WriteLine("🚀 Sending SignalR to user: " + userId);

            await _hubContext.Clients.User(userId.ToString())
                .SendAsync("ReceiveNotification", payload);
        }
    }
}