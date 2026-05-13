
public class ApplyJobDto
{
    public byte[] Resume { get; set; } = null!;
    public string FileName { get; set; } = null!;
    public string? CoverLetter { get; set; }

    public string? CandidateName { get; set; }

    public string? Email { get; set; }

    public string? PhoneNumber { get; set; }

    public List<string>? Skills { get; set; }
}