using FluentAssertions;
using JobPortal.Application.DTOs.Users;
using JobPortal.Domain.Entities;
using JobPortal.Infrastructure.Persistence;
using JobPortal.IntegrationTests.Factories;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace JobPortal.IntegrationTests.Tests.Admin
{
    public class AdminAuthorizationTests
        : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory _factory;

        public AdminAuthorizationTests(
            CustomWebApplicationFactory factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task
        GetUsers_WithoutToken_Should_Return_Unauthorized()
        {
            // Act
            var response = await _client.GetAsync(
                "/api/admin/users");

            // Assert
            response.StatusCode.Should()
                .Be(HttpStatusCode.Unauthorized);
        }

        [Fact]
        public async Task
GetUsers_WithSeekerRole_Should_Return_Forbidden()
        {
            // Arrange - Seed seeker user
            using var scope = _factory.CreateScope();

            var dbContext = scope.ServiceProvider
                .GetRequiredService<JobPortalDbContext>();

            var seeker = new User
            {
                Name = "Seeker User",
                Email = "seeker@test.com",
                PasswordHash =
                    BCrypt.Net.BCrypt.HashPassword(
                        "Password123!"),
                Role = "Seeker"
            };

            dbContext.Users.Add(seeker);
            await dbContext.SaveChangesAsync();

            // Arrange - Login
            var loginRequest = new LoginDto
            {
                Email = "seeker@test.com",
                Password = "Password123!"
            };

            var loginResponse =
                await _client.PostAsJsonAsync(
                    "/api/user/login",
                    loginRequest);

            loginResponse.StatusCode.Should()
                .Be(HttpStatusCode.OK);

            var loginContent =
                await loginResponse
                    .Content
                    .ReadAsStringAsync();

            using var jsonDoc =
                JsonDocument.Parse(loginContent);

            var token = jsonDoc
                .RootElement
                .GetProperty("token")
                .GetString();

            // Attach JWT
            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue(
                    "Bearer",
                    token);

            // Act
            var response = await _client.GetAsync(
                "/api/admin/users");

            // Assert
            response.StatusCode.Should()
                .Be(HttpStatusCode.Forbidden);
        }

        [Fact]
        public async Task GetUsers_WithAdminRole_Should_Return_Ok()
        {
            // Arrange - Seed admin user
            using var scope = _factory.CreateScope();

            var dbContext = scope.ServiceProvider
                .GetRequiredService<JobPortalDbContext>();

            var admin = new User
            {
                Name = "Admin User",
                Email = "adminuser@test.com",
                PasswordHash =
                    BCrypt.Net.BCrypt.HashPassword(
                        "Admin123!"),
                Role = "Admin"
            };

            dbContext.Users.Add(admin);
            await dbContext.SaveChangesAsync();

            // Arrange - Login
            var loginRequest = new LoginDto
            {
                Email = "adminuser@test.com",
                Password = "Admin123!"
            };

            var loginResponse =
                await _client.PostAsJsonAsync(
                    "/api/user/login",
                    loginRequest);

            loginResponse.StatusCode.Should()
                .Be(HttpStatusCode.OK);

            var loginContent =
                await loginResponse
                    .Content
                    .ReadAsStringAsync();

            using var jsonDoc =
                JsonDocument.Parse(loginContent);

            var token = jsonDoc
                .RootElement
                .GetProperty("token")
                .GetString();

            // Attach JWT
            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue(
                    "Bearer",
                    token);

            // Act
            var response = await _client.GetAsync(
                "/api/admin/users");

            // Assert
            response.StatusCode.Should()
                .Be(HttpStatusCode.OK);
        }
    }
}