using System;

namespace JobPortal.Domain.Entities
{
    public class ProviderRestriction
    {
        public int Id { get; set; }

        // Provider who requested the restriction (the provider owning the jobs)
        public int ProviderId { get; set; }

        // Seeker who is restricted by this provider
        public int SeekerId { get; set; }

        // Report that led to this restriction (optional but tracked)
        public int? ReportId { get; set; }

        // When restriction was created (UTC)
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

        // Navigation (optional)
        public User? Provider { get; set; }
        public User? Seeker { get; set; }
        public Report? Report { get; set; }
    }
}