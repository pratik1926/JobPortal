using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JobPortal.Application.DTOs.Email
{
    public class JobApplicationEmailDto
    {
        public int JobId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public int SeekerId { get; set; }
        public string SeekerName { get; set; } = string.Empty;
        public string SeekerEmail { get; set; } = string.Empty;
        public string? ProfileSummary { get; set; }
        public string? CoverLetter { get; set; }
        public DateTime AppliedAtUtc { get; set; }
        public string? ResumeFileName { get; set; }  // optional
    }
}
