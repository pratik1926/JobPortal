using FluentAssertions;
using JobPortal.Application.DTOs.Users ;
using JobPortal.Application.DTOs.Jobs;
using JobPortal.Domain.Entities;
using JobPortal.Infrastructure.Persistence;
using JobPortal.IntegrationTests.Factories;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace JobPortal.IntegrationTests.Tests.Job
{
    public class CreateJobIntegrationTests
        : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory _factory;

        public CreateJobIntegrationTests(
            CustomWebApplicationFactory factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task
        Provider_Should_Create_Job_Successfully()
        {
            // Arrange - Seed Provider
            using var scope = _factory.CreateScope();

            var dbContext = scope.ServiceProvider
                .GetRequiredService<JobPortalDbContext>();

            var provider = new User
            {
                Name = "Provider User",
                Email = "provider@test.com",
                PasswordHash =
                    BCrypt.Net.BCrypt.HashPassword(
                        "Password123!"),
                Role = "Provider"
            };

            dbContext.Users.Add(provider);
            await dbContext.SaveChangesAsync();

            // Arrange - Login
            var loginRequest = new LoginDto
            {
                Email = "provider@test.com",
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

            // Arrange - Create Job DTO
            var createJobRequest =
                new CreateJobDto
                {
                    Title = "Software Developer",
                    Description =
                        "Need React Developer",
                    Budget = 5000,
                    Location = "Kathmandu",
                    Skills = "React, .NET"
                };

            // Act
            var response =
                await _client.PostAsJsonAsync(
                    "/api/job",
                    createJobRequest);

            // Assert
            response.StatusCode.Should()
                .Be(HttpStatusCode.OK);

            var content =
                await response.Content
                    .ReadAsStringAsync();

            content.Should()
                .Contain(
                    "Job Created Successfully");
        }

        [Fact]
        public async Task Seeker_Should_Not_Create_Job()
        {
            // Arrange - Seed seeker
            using var scope = _factory.CreateScope();

            var dbContext = scope.ServiceProvider
                .GetRequiredService<JobPortalDbContext>();

            var seeker = new User
            {
                Name = "Seeker User",
                Email = "seekerjob@test.com",
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
                Email = "seekerjob@test.com",
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

            // Arrange - Job DTO
            var createJobRequest =
                new CreateJobDto
                {
                    Title = "Unauthorized Job",
                    Description =
                        "Should fail",
                    Budget = 3000,
                    Location = "Kathmandu",
                    Skills = "React"
                };

            // Act
            var response =
                await _client.PostAsJsonAsync(
                    "/api/job",
                    createJobRequest);

            // Assert
            response.StatusCode.Should()
                .Be(HttpStatusCode.Forbidden);
        }
    }
}