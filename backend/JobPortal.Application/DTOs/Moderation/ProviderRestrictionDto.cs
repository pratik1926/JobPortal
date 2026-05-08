using System;

namespace JobPortal.Application.DTOs.Moderation
{
    public class ProviderRestrictionDto
    {
        public int Id { get; set; }
        public int ProviderId { get; set; }
        public int SeekerId { get; set; }
        public int? ReportId { get; set; }
        public DateTime CreatedAtUtc { get; set; }
    }
}