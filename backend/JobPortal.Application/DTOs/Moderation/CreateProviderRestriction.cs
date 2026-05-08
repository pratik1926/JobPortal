namespace JobPortal.Application.DTOs.Moderation
{
    public class CreateProviderRestrictionDto
    {
        public int ProviderId { get; set; }
        public int SeekerId { get; set; }
        public int? ReportId { get; set; }
    }
}