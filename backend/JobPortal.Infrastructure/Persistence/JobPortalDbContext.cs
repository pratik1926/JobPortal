//using Microsoft.EntityFrameworkCore;
//using JobPortal.Domain.Entities;
//using Microsoft.AspNetCore.Identity;

//namespace JobPortal.Infrastructure.Persistence;

//public class JobPortalDbContext : DbContext
//{

//    public JobPortalDbContext(DbContextOptions<JobPortalDbContext> options)
//        : base(options)
//    {
//    }

//    public DbSet<User> Users { get; set; }
//    public DbSet<Job> Jobs { get; set; }
//    public DbSet<Domain.Entities.Application> Applications { get; set; }

//    protected override void OnModelCreating(ModelBuilder modelBuilder)
//    {
//        // 🔥 FIX: Prevent multiple cascade delete paths
//        modelBuilder.Entity<Domain.Entities.Application>()
//            .HasOne(a => a.Seeker)
//            .WithMany(u => u.Applications)
//            .HasForeignKey(a => a.SeekerId)
//            .OnDelete(DeleteBehavior.Restrict);

//        // Optional: define precision for Budget (removes warning)
//        modelBuilder.Entity<Job>()
//            .Property(j => j.Budget)
//            .HasPrecision(18, 2);
//    }
//}

using Microsoft.EntityFrameworkCore;
using JobPortal.Domain.Entities;
using BCrypt.Net;
namespace JobPortal.Infrastructure.Persistence;

public class JobPortalDbContext : DbContext
{
    public JobPortalDbContext(DbContextOptions<JobPortalDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Job> Jobs { get; set; }
    public DbSet<Domain.Entities.Application> Applications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 🔥 FIX: Prevent multiple cascade delete paths
        modelBuilder.Entity<Domain.Entities.Application>()
            .HasOne(a => a.Seeker)
            .WithMany(u => u.Applications)
            .HasForeignKey(a => a.SeekerId)
            .OnDelete(DeleteBehavior.Restrict);

        // ✅ Budget precision
        modelBuilder.Entity<Job>()
            .Property(j => j.Budget)
            .HasPrecision(18, 2);

        // 🔥 ADMIN SEEDING (USING BCRYPT)

        var admin = new User
        {
            Id = 999,
            Email = "admin@test.com",
            Role = "Admin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123")
        };


        modelBuilder.Entity<User>().HasData(admin);
    }
}