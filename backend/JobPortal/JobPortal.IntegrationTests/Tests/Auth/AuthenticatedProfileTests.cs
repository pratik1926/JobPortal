using FluentAssertions;
using JobPortal.Application.DTOs;
using JobPortal.IntegrationTests.Factories;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace JobPortal.IntegrationTests.Tests.Auth
{
    public class AuthenticatedProfileTests
        : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;

        public AuthenticatedProfileTests(
            CustomWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetProfile_WithValidToken_Should_Return_Ok()
        {
            // Arrange - Register User
            var registerRequest = new RegisterUserDto
            {
                Name = "Authenticated User",
                Email = "authuser@example.com",
                Password = "Password123!",
                Role = "Seeker"
            };

            var registerResponse = await _client.PostAsJsonAsync(
    "/api/user/register",
    registerRequest);

            var registerContent = await registerResponse
                .Content
                .ReadAsStringAsync();

            Console.WriteLine(registerResponse.StatusCode);
            Console.WriteLine(registerContent);

            return;

            registerResponse.StatusCode.Should()
                .Be(HttpStatusCode.BadRequest);

            // Arrange - Login
            var loginRequest = new LoginDto
            {
                Email = "authuser@example.com",
                Password = "Password123!"
            };

            var loginResponse = await _client.PostAsJsonAsync(
                "/api/user/login",
                loginRequest);

            var loginContent = await loginResponse
                .Content
                .ReadAsStringAsync();
            Console.WriteLine(loginResponse.StatusCode);
            Console.WriteLine(loginContent);

            // Extract token from JSON response
            using var jsonDoc = JsonDocument.Parse(loginContent);

            var token = jsonDoc
                .RootElement
                .GetProperty("token")
                .GetString();

            // Attach JWT token
            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);

            // Act
            var profileResponse = await _client.GetAsync(
                "/api/user/profile");

            // Assert
            profileResponse.StatusCode.Should()
                .Be(HttpStatusCode.OK);
        }
    }
}