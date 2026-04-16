using Microsoft.AspNetCore.Http;

namespace JobPortal.API.DTOs
{
    public class ApplyJobRequest
    {
        public IFormFile Resume { get; set; } = null!;
        public string? CoverLetter { get; set; }
    }
}