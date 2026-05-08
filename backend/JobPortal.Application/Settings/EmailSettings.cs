using System.Collections.Generic;

namespace JobPortal.Application.Settings
{
    public class EmailSettings
    {
        public string FromEmail { get; set; } = string.Empty;
        public string FromName { get; set; } = "Job Portal";
        public string SmtpServer { get; set; } = string.Empty;
        public int SmtpPort { get; set; } = 587;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool UseSsl { get; set; } = false;
        public bool UseStartTls { get; set; } = true;
        public long MaxAttachmentSizeBytes { get; set; } = 10 * 1024 * 1024; // 10 MB
        public List<string> AllowedAttachmentMimeTypes { get; set; } = new List<string>
        {
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        };
    }
}