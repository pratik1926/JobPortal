namespace JobPortal.Application.DTOs;

public class CreateJobDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Budget { get; set; }
    public string Location { get; set; } = string.Empty;
    public int ProviderId { get; set; }
    public string? Skills { get; set; }
}