namespace JobPortal.Application.DTOs.Jobs
{
    public class BulkJobResultDto
    {
        public string Title { get; set; }
        public string Status { get; set; }
        public string? Error { get; set; }
    }
}