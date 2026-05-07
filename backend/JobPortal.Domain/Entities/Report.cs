using System;
namespace JobPortal.Domain.Entities
{
    public class Report
    {
        public int Id { get; set; }

        public int ReporterId { get; set; }

        public int ReportedUserId { get; set; }

        public int ApplicationId { get; set; }

        public string Reason { get; set; } = string.Empty;
        public string? Details { get; set; }

        public string Status { get; set; } = "Pending"; // Pending, Reviewed, ActionTaken
        public bool IsResolved { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public User Reporter { get; set; }
        public User ReportedUser { get; set; }
        public Application Application { get; set; }

        public string? AdminNotes { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public int? ReviewedByAdminId { get; set; }
    }
}