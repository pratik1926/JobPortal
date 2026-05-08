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

    public DbSet<Notification> Notifications { get; set; }
    public DbSet<EmailVerification> EmailVerifications { get; set; }

    public DbSet<Report> Reports { get; set; }

    public DbSet<ProviderRestriction> ProviderRestrictions { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        //Prevent multiple cascade delete paths
        modelBuilder.Entity<Domain.Entities.Application>()
            .HasOne(a => a.Seeker)
            .WithMany(u => u.Applications)
            .HasForeignKey(a => a.SeekerId)
            .OnDelete(DeleteBehavior.Restrict);

        //Budget precision
        modelBuilder.Entity<Job>()
            .Property(j => j.Budget)
            .HasPrecision(18, 2);

        // Configure Report relationships
        modelBuilder.Entity<Report>()
            .HasOne(r => r.Reporter)
            .WithMany()
            .HasForeignKey(r => r.ReporterId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Report>()
            .HasOne(r => r.ReportedUser)
            .WithMany()
            .HasForeignKey(r => r.ReportedUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Report>()
            .HasOne(r => r.Application)
            .WithMany()
            .HasForeignKey(r => r.ApplicationId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ProviderRestriction>(b =>
        {
            b.ToTable("ProviderRestrictions");

            b.HasKey(x => x.Id);

            b.Property(x => x.CreatedAtUtc)
                .HasDefaultValueSql("GETUTCDATE()");

            b.HasIndex(x => new { x.ProviderId, x.SeekerId })
                .IsUnique()
                .HasDatabaseName("IX_ProviderRestriction_Provider_Seeker");

            // foreign keys (restrict deletes to avoid cascading deletes)
            b.HasOne(x => x.Provider)
                .WithMany()
                .HasForeignKey(x => x.ProviderId)
                .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(x => x.Seeker)
                .WithMany()
                .HasForeignKey(x => x.SeekerId)
                .OnDelete(DeleteBehavior.Restrict);

            b.HasOne(x => x.Report)
                .WithMany()
                .HasForeignKey(x => x.ReportId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        //ADMIN SEEDING (USING BCRYPT)

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