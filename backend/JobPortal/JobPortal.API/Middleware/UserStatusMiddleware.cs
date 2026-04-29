using JobPortal.Application.Interfaces;
using System.Security.Claims;

namespace JobPortal.API.Middleware
{
    public class UserStatusMiddleware
    {
        private readonly RequestDelegate _next;

        public UserStatusMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IUserRepository userRepository)
        {
            var user = context.User;

            // ✅ ONLY RUN IF AUTHENTICATED
            if (user?.Identity?.IsAuthenticated == true)
            {
                var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);

                // ✅ SAFE CHECK
                if (userIdClaim == null)
                {
                    await _next(context);
                    return;
                }

                // ✅ SAFE PARSE
                if (!int.TryParse(userIdClaim.Value, out var userId))
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsync("Invalid token");
                    return;
                }

                var dbUser = await userRepository.GetUserByIdAsync(userId);

                // ✅ If user not found → skip (avoid crash)
                if (dbUser == null)
                {
                    await _next(context);
                    return;
                }

                // 🔥 BLOCK DELETED
                if (dbUser.IsDeleted)
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsync("Account deleted");
                    return;
                }

                // 🔥 BLOCK BANNED
                if (dbUser.IsBanned)
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    await context.Response.WriteAsync("Account banned");
                    return;
                }
            }

            await _next(context);
        }
    }
}