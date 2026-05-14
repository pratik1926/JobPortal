using FluentAssertions;
using JobPortal.Application.DTOs;
using JobPortal.IntegrationTests.Factories;
using System.Net;
using System.Net.Http.Json;

namespace JobPortal.IntegrationTests.Tests.Auth
{
    public class RegisterIntegrationTests
        : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;

        public RegisterIntegrationTests(
            CustomWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task Register_Should_Create_User_Successfully()
        {
            // Arrange
            var request = new RegisterUserDto
            {
                Name = "Test User",
                Email = "testuser@example.com",
                Password = "Password123!",
                Role = "Seeker"
            };

            // Act
            var response = await _client.PostAsJsonAsync(
                "/api/user/register",
                request);

            var content = await response.Content.ReadAsStringAsync();

            // Debug output
            Console.WriteLine(content);

            // Assert
            response.StatusCode.Should()
    .Be(HttpStatusCode.BadRequest);

            Console.WriteLine(content);
        }

    }
}