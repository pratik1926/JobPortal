namespace JobPortal.Application.DTOs.Reports
{
    public class JobReportPreviewDto
    {
        public int JobId { get; set; }

        public string JobTitle { get; set; }

        public string Location { get; set; }

        public decimal Budget { get; set; }

        public int ProviderId { get; set; }

        public int TotalApplications { get; set; }

        public int ApprovedApplications { get; set; }

        public int RejectedApplications { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}