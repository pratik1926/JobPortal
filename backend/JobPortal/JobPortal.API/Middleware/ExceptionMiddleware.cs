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


using JobPortal.Application.Exceptions;
using System.Net;
using System.Text.Json;
using FluentValidation;

namespace JobPortal.API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IWebHostEnvironment _env;

        public ExceptionMiddleware(
            RequestDelegate next,
            ILogger<ExceptionMiddleware> logger,
            IWebHostEnvironment env)
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
                _logger.LogError(ex, "Unhandled exception occurred");

                await HandleExceptionAsync(context, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            context.Response.ContentType = "application/json";

            var statusCode = HttpStatusCode.InternalServerError;
            string message = "Something went wrong";

            switch (ex)
            {
                // 🔥 Custom Exceptions
                case BadRequestException badRequest:
                    statusCode = HttpStatusCode.BadRequest;
                    message = badRequest.Message;
                    break;

                case NotFoundException notFound:
                    statusCode = HttpStatusCode.NotFound;
                    message = notFound.Message;
                    break;

                case UnauthorizedAccessException:
                    statusCode = HttpStatusCode.Unauthorized;
                    message = "Unauthorized access";
                    break;

                // 🔥 FluentValidation
                case ValidationException validationEx:
                    statusCode = HttpStatusCode.BadRequest;
                    message = validationEx.Errors.FirstOrDefault()?.ErrorMessage ?? "Validation failed";
                    break;

                // 🔥 Fallback (for dev clarity)
                case ArgumentException argEx:
                case InvalidOperationException invOpEx:
                    statusCode = HttpStatusCode.BadRequest;
                    message = ex.Message;
                    break;
            }

            context.Response.StatusCode = (int)statusCode;

            var response = new
            {
                success = false,
                message,
                statusCode = (int)statusCode,
                timestamp = DateTime.UtcNow,

                // only for dev
                detail = _env.IsDevelopment() ? ex.StackTrace : null,
                exceptionType = _env.IsDevelopment() ? ex.GetType().Name : null
            };

            return context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}