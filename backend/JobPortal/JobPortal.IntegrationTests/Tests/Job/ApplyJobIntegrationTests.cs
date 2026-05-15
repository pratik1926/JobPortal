using FluentAssertions;
using JobPortal.Application.DTOs;
using JobPortal.Domain.Entities;
using JobPortal.Infrastructure.Persistence;
using JobPortal.IntegrationTests.Factories;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.IntegrationTests.Tests.Job
{
    public class ApplyJobIntegrationTests
        : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory _factory;

        public ApplyJobIntegrationTests(
            CustomWebApplicationFactory factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task
        Seeker_Should_Apply_To_Job_Successfully()
        {
            using var scope =
                _factory.CreateScope();

            var dbContext =
                scope.ServiceProvider
                .GetRequiredService<
                    JobPortalDbContext>();

            // Arrange - Provider
            var provider = new User
            {
                Name = "Provider",
                Email = "providerapply@test.com",
                PasswordHash =
                    BCrypt.Net.BCrypt
                    .HashPassword(
                        "Password123!"),
                Role = "Provider"
            };

            dbContext.Users.Add(provider);
            await dbContext.SaveChangesAsync();

            // Login provider
            var providerLogin =
                await _client
                .PostAsJsonAsync(
                    "/api/user/login",
                    new LoginDto
                    {
                        Email =
                        "providerapply@test.com",

                        Password =
                        "Password123!"
                    });

            var providerContent =
                await providerLogin
                .Content
                .ReadAsStringAsync();

            var providerToken =
                JsonDocument.Parse(
                    providerContent)
                .RootElement
                .GetProperty("token")
                .GetString();

            _client
                .DefaultRequestHeaders
                .Authorization =
                new AuthenticationHeaderValue(
                    "Bearer",
                    providerToken);

            // Create Job
            var createJobResponse =
                await _client
                .PostAsJsonAsync(
                    "/api/job",
                    new CreateJobDto
                    {
                        Title =
                            "Backend Developer",
                        Description =
                            "Need .NET Dev",
                        Budget = 5000,
                        Location =
                            "Kathmandu",
                        Skills =
                            ".NET"
                    });

            createJobResponse
                .StatusCode
                .Should()
                .Be(HttpStatusCode.OK);

            // Get Job ID
            var createdJob =
                await dbContext.Jobs
                .FirstAsync();

            var jobId =
                createdJob.Id;

            // Arrange - Seeker
            var seeker =
                new User
                {
                    Name =
                        "Seeker",
                    Email =
                        "seekerapply@test.com",
                    PasswordHash =
                        BCrypt.Net.BCrypt
                        .HashPassword(
                            "Password123!"),
                    Role =
                        "Seeker"
                };

            dbContext.Users
                .Add(seeker);

            await dbContext
                .SaveChangesAsync();

            // Login seeker
            var seekerLogin =
                await _client
                .PostAsJsonAsync(
                    "/api/user/login",
                    new LoginDto
                    {
                        Email =
                        "seekerapply@test.com",

                        Password =
                        "Password123!"
                    });

            var seekerContent =
                await seekerLogin
                .Content
                .ReadAsStringAsync();

            var seekerToken =
                JsonDocument.Parse(
                    seekerContent)
                .RootElement
                .GetProperty("token")
                .GetString();

            _client
                .DefaultRequestHeaders
                .Authorization =
                new AuthenticationHeaderValue(
                    "Bearer",
                    seekerToken);

            // Arrange - Fake PDF
            var pdfBytes =
                Encoding.UTF8
                .GetBytes(
                    "Fake PDF Resume");

            var formData =
                new MultipartFormDataContent();

            var fileContent =
                new ByteArrayContent(
                    pdfBytes);

            fileContent.Headers
                .ContentType =
                new MediaTypeHeaderValue(
                    "application/pdf");

            formData.Add(
                fileContent,
                "Resume",
                "resume.pdf");

            formData.Add(
                new StringContent(
                    "Interested in role"),
                "CoverLetter");

            // Act
            var response =
                await _client.PostAsync(
                    $"/api/job/apply/{jobId}",
                    formData);

            // Assert
            response.StatusCode
                .Should()
                .Be(HttpStatusCode.OK);

            var content =
                await response
                .Content
                .ReadAsStringAsync();

            content.Should()
                .Contain(
                    "Applied successfully");
        }
    }
}