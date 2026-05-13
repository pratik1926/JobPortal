namespace JobPortal.API.DTOs
{
    public class ParseResumeRequest
    {
        public IFormFile Resume { get; set; } = null!;
    }
}