namespace JobPortal.Application.DTOs.Resume
{
    public class ResumeDataDto
    {
        public string? FullText { get; set; }

        public string? CandidateName { get; set; }

        public string? Email { get; set; }

        public string? PhoneNumber { get; set; }

        public List<string> Skills { get; set; } = new();

        public List<string> Education { get; set; } = new();

        public List<string> Experience { get; set; } = new();
    }
}