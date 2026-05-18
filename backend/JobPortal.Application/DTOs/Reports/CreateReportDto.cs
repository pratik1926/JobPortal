using System.ComponentModel.DataAnnotations;

namespace JobPortal.Application.DTOs.Reports
{
    
    public class CreateReportDto
    {
        [Required]
        public int ApplicationId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Reason { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Details { get; set; }
    }
}
