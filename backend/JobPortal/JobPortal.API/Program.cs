using JobPortal.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using JobPortal.Application.Interfaces;
using JobPortal.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using JobPortal.Application.Services;
using JobPortal.Infrastructure.Services;
using FluentValidation;
using FluentValidation.AspNetCore;
using Serilog;
using JobPortal.Application.Validators;
using JobPortal.API.Hubs;
using JobPortal.API.Services;
using JobPortal.API.Infrastructure;
using Microsoft.AspNetCore.SignalR;
using JobPortal.API.Middleware;
using Microsoft.AspNetCore.Mvc;

namespace JobPortal.API
{
    public class Program
    {
        public static void Main(string[] args)
        {

            // 🔥 STEP 1 — Configure Serilog FIRST
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                .Enrich.FromLogContext()
                .WriteTo.Console()
                .WriteTo.File("logs/log-.txt", rollingInterval: RollingInterval.Day)
                .CreateLogger();

            var builder = WebApplication.CreateBuilder(args);

            // 🔥 STEP 2 — Replace default logger
            builder.Host.UseSerilog();

            // Add services to the container.

            builder.Services.AddControllers();

            builder.Services.Configure<ApiBehaviorOptions>(options =>
            {
                options.SuppressModelStateInvalidFilter = true;
            });

            builder.Services.AddFluentValidationAutoValidation();
            builder.Services.AddValidatorsFromAssemblyContaining<RegisterUserDtoValidator>();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            //builder.Services.AddSwaggerGen();

            builder.Services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Description = "Enter JWT like: Bearer {your token}"
                });

                options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
            });

            builder.Services.AddDbContext<JobPortalDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddScoped<IAuthService, AuthService>();

            builder.Services.AddScoped<IJobRepository, JobRepository>();

            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IUserService, UserService>();

            var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]);

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,

                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };
                // 🔥 CRITICAL FOR SIGNALR
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];

                        var path = context.HttpContext.Request.Path;

                        if (!string.IsNullOrEmpty(accessToken) &&
                            path.StartsWithSegments("/hubs/notification"))
                        {
                            context.Token = accessToken;
                        }

                        return Task.CompletedTask;
                    }
                };

            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:5173")
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              .AllowCredentials();
                    });
            });

            builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

            builder.Services.AddScoped<IJobService, JobService>();
            //builder.Services.AddScoped<IJobRepository, JobRepository>();

            builder.Services.AddScoped<IApplicationService, ApplicationService>();

            builder.Services.AddScoped<IFileService, FileService>();
            
            builder.Services.AddScoped<INotificationRepository, NotificationRepository>();

            builder.Services.AddScoped<INotificationService, NotificationService>();

            builder.Services.AddScoped<IVerificationService, VerificationService>();

            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddScoped<IEmailVerificationRepository, EmailVerificationRepository>();

            builder.Services.AddSignalR();
            builder.Services.AddScoped<INotificationSender, SignalRNotificationSender>();

            // 🔥 USER MAPPING (VERY IMPORTANT)
            builder.Services.AddSingleton<IUserIdProvider, SignalRUserIdProvider>();

            builder.Services.AddScoped<IAdminService, AdminService>();
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowFrontend");

            // 🔥 STEP 3 — Add request logging
            app.UseSerilogRequestLogging();

            

            app.UseAuthentication();

            app.UseMiddleware<ExceptionMiddleware>();
            app.UseMiddleware<UserStatusMiddleware>();

            app.UseAuthorization();

            //app.UseMiddleware<UserStatusMiddleware>();


            app.MapHub<NotificationHub>("/hubs/notification");

            app.UseStaticFiles();   

            app.MapControllers();

            app.Run();
        }
    }
}
