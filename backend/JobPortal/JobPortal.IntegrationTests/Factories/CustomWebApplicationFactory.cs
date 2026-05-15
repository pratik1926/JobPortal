using JobPortal.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using JobPortal.API;


namespace JobPortal.IntegrationTests.Factories
{
    public class CustomWebApplicationFactory
        : WebApplicationFactory<Program>
    {
        private SqliteConnection _connection = null!;

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Testing");

            builder.ConfigureServices(services =>
            {
                // Remove existing DbContext registration
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType ==
                    typeof(DbContextOptions<JobPortalDbContext>));

                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                // Create SQLite in-memory connection
                _connection = new SqliteConnection("DataSource=:memory:");
                _connection.Open();

                // Register test database
                services.AddDbContext<JobPortalDbContext>(options =>
                {
                    options.UseSqlite(_connection);
                });

                // Build service provider
                var sp = services.BuildServiceProvider();

                // Create scope
                using var scope = sp.CreateScope();

                var db = scope.ServiceProvider
                    .GetRequiredService<JobPortalDbContext>();

                // Create database schema
                db.Database.EnsureCreated();
            });
        }

        protected override void Dispose(bool disposing)
        {
            base.Dispose(disposing);

            _connection?.Dispose();
        }

        public IServiceScope CreateScope()
        {
            return Services.CreateScope();
        }
    }
}