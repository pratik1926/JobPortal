//using System.Net;
//using System.Text.Json;
//using Microsoft.Extensions.Logging;
//namespace JobPortal.API.Middleware
//{
//    public class ExceptionMiddleware
//    {
//        private readonly RequestDelegate _next;
//        private readonly ILogger<ExceptionMiddleware> _logger;

//        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
//        {
//            _next = next;
//            _logger = logger;
//        }

//        public async Task Invoke(HttpContext context)
//        {
//            try
//            {
//                await _next(context);
//            }
//            catch (Exception ex)
//            {
//                // 🔥 LOG THE ERROR
//                _logger.LogError(ex, "Unhandled exception occurred");
//                await HandleExceptionAsync(context, ex);
//            }
//        }

//        private static Task HandleExceptionAsync(HttpContext context, Exception ex)
//        {
//            context.Response.ContentType = "application/json";

//            var statusCode = HttpStatusCode.InternalServerError;
//            var message = ex.Message;

//            // 🔥 Customize error types
//            switch (ex)
//            {
//                case UnauthorizedAccessException:
//                    statusCode = HttpStatusCode.Unauthorized;
//                    message = ex.Message;
//                    break;

//                case ArgumentException:
//                    statusCode = HttpStatusCode.BadRequest;
//                    message = ex.Message;
//                    break;

//                case InvalidOperationException:
//                    statusCode = HttpStatusCode.BadRequest;
//                    message = ex.Message;
//                    break;

//                default:
//                    message = ex.Message;
//                    break;
//            }

//            context.Response.StatusCode = (int)statusCode;

//            var response = new
//            {
//                success = false,
//                message,
//                statusCode = context.Response.StatusCode
//            };

//            return context.Response.WriteAsync(JsonSerializer.Serialize(response));
//        }
//    }
//}


using System.Net;
using System.Text.Json;

namespace JobPortal.API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IWebHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IWebHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                // 🔥 FULL LOG (always)
                _logger.LogError(ex, "Unhandled exception occurred");

                await HandleExceptionAsync(context, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            context.Response.ContentType = "application/json";

            var statusCode = HttpStatusCode.InternalServerError;
            var message = ex.Message;

            switch (ex)
            {
                case UnauthorizedAccessException:
                    statusCode = HttpStatusCode.Unauthorized;
                    break;

                case ArgumentException:
                case InvalidOperationException:
                    statusCode = HttpStatusCode.BadRequest;
                    break;
            }

            context.Response.StatusCode = (int)statusCode;

            var response = new
            {
                success = false,
                message,
                statusCode = context.Response.StatusCode,

                // 🔥 SHOW DETAILS ONLY IN DEV
                detail = _env.IsDevelopment() ? ex.StackTrace : null,
                exceptionType = _env.IsDevelopment() ? ex.GetType().Name : null
            };

            return context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}