using FluentAssertions;
using JobPortal.IntegrationTests.Factories;
using System.Net;

namespace JobPortal.IntegrationTests.Tests.Auth
{
    public class ProfileAuthorizationTests
        : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;

        public ProfileAuthorizationTests(
            CustomWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetProfile_WithoutToken_Should_Return_Unauthorized()
        {
            // Act
            var response = await _client.GetAsync(
                "/api/user/profile");

            // Assert
            response.StatusCode.Should()
                .Be(HttpStatusCode.Unauthorized);
        }
    }
}