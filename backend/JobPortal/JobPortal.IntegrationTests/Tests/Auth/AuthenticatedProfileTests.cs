using FluentAssertions;
using JobPortal.Application.DTOs;
using JobPortal.Domain.Entities;
using JobPortal.Infrastructure.Persistence;
using JobPortal.IntegrationTests.Factories;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.DependencyInjection;

namespace JobPortal.IntegrationTests.Tests.Auth
{
    public class AuthenticatedProfileTests
        : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory _factory;

        public AuthenticatedProfileTests(
            CustomWebApplicationFactory factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetProfile_WithValidToken_Should_Return_Ok()
        {
            // Arrange - Seed user directly into DB
            using var scope = _factory.CreateScope();

            var dbContext = scope.ServiceProvider
                .GetRequiredService<JobPortalDbContext>();

            var user = new User
            {
                Name = "Test User",
                Email = "authuser@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
                Role = "Seeker"
            };

            dbContext.Users.Add(user);
            await dbContext.SaveChangesAsync();

            // Arrange - Login
            var loginRequest = new LoginDto
            {
                Email = "authuser@test.com",
                Password = "Password123!"
            };

            var loginResponse = await _client.PostAsJsonAsync(
                "/api/user/login",
                loginRequest);

            loginResponse.StatusCode.Should()
                .Be(HttpStatusCode.OK);

            var loginContent = await loginResponse
                .Content
                .ReadAsStringAsync();

            using var jsonDoc = JsonDocument.Parse(loginContent);

            var token = jsonDoc
                .RootElement
                .GetProperty("token")
                .GetString();

            // Attach JWT token
            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue(
                    "Bearer",
                    token);

            // Act
            var profileResponse = await _client.GetAsync(
                "/api/user/profile");

            // Assert
            profileResponse.StatusCode.Should()
                .Be(HttpStatusCode.OK);
        }
    }
}