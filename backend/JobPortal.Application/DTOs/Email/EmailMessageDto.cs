using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JobPortal.Application.DTOs.Email
{
    public class EmailMessageDto
    {
        public string ToEmail { get; set; } = string.Empty;
        public string ToName { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string? HtmlBody { get; set; }
        public string? PlainTextBody { get; set; }
        public List<EmailAttachmentDto> Attachments { get; set; } = new();
        public string? FromEmail { get; set; }
        public string? FromName { get; set; }
    }
}
