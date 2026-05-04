namespace JobPortal.Application.DTOs
{
    public class CreateJobBulkDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Budget { get; set; }
        public string Location { get; set; }
        public string Skills { get; set; }
    }
}