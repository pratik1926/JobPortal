namespace JobPortal.Application.DTOs
{
    public class ApplicationProviderDto
    {
        public int Id { get; set; }
        public string SeekerEmail { get; set; }
        public string JobTitle { get; set; }
        public string Status { get; set; }
        public DateTime AppliedAt { get; set; }
    }
}