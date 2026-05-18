using FluentAssertions;
using JobPortal.Application.DTOs.Users;
using JobPortal.Application.DTOs.Jobs;
using JobPortal.Domain.Entities;
using JobPortal.Infrastructure.Persistence;
using JobPortal.IntegrationTests.Factories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;

namespace JobPortal.IntegrationTests.Tests.Job
{
    public class RestrictedSeekerApplyTests
        : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory _factory;

        public RestrictedSeekerApplyTests(
            CustomWebApplicationFactory factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task
        Restricted_Seeker_Should_Not_Apply()
        {
            using var scope =
                _factory.CreateScope();

            var dbContext =
                scope.ServiceProvider
                .GetRequiredService<JobPortalDbContext>();

            // Arrange - Provider
            var provider = new User
            {
                Name = "Provider",
                Email = "restrictedprovider@test.com",
                PasswordHash =
                    BCrypt.Net.BCrypt
                    .HashPassword(
                        "Password123!"),
                Role = "Provider"
            };

            dbContext.Users.Add(provider);
            await dbContext.SaveChangesAsync();

            // Arrange - Seeker
            var seeker = new User
            {
                Name = "Restricted Seeker",
                Email = "restrictedseeker@test.com",
                PasswordHash =
                    BCrypt.Net.BCrypt
                    .HashPassword(
                        "Password123!"),
                Role = "Seeker"
            };

            dbContext.Users.Add(seeker);
            await dbContext.SaveChangesAsync();

            // Arrange - Restriction
            dbContext.ProviderRestrictions
                .Add(new ProviderRestriction
                {
                    ProviderId =
                        provider.Id,

                    SeekerId =
                        seeker.Id
                });

            await dbContext
                .SaveChangesAsync();

            // Login provider
            var providerLogin =
                await _client
                .PostAsJsonAsync(
                    "/api/user/login",
                    new LoginDto
                    {
                        Email =
                        "restrictedprovider@test.com",

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

            // Create job
            await _client
                .PostAsJsonAsync(
                    "/api/job",
                    new CreateJobDto
                    {
                        Title =
                            "Blocked Job",
                        Description =
                            "Test restriction",
                        Budget = 5000,
                        Location =
                            "Kathmandu",
                        Skills =
                            ".NET"
                    });

            var job =
                await dbContext.Jobs
                .FirstAsync();

            // Login seeker
            var seekerLogin =
                await _client
                .PostAsJsonAsync(
                    "/api/user/login",
                    new LoginDto
                    {
                        Email =
                        "restrictedseeker@test.com",

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
                    "Fake Resume");

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

            // Act
            var response =
                await _client.PostAsync(
                    $"/api/job/apply/{job.Id}",
                    formData);

            // Assert
            response.StatusCode
                .Should()
                .Be(
                    HttpStatusCode.Unauthorized);
        }
    }
}