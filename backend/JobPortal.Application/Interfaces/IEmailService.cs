using System.Threading;
using System.Threading.Tasks;
using JobPortal.Application.DTOs.Email;

namespace JobPortal.Application.Interfaces
{
    public interface IEmailService
    {
        // Low-level send that accepts DTO with attachments
        Task<bool> SendAsync(EmailMessageDto message, CancellationToken cancellationToken = default);

        // Send by template (renderer used internally)
        Task<bool> SendTemplateAsync<TModel>(string toEmail, string toName, string subject, string templateKey, TModel model, CancellationToken cancellationToken = default);

        // Back-compat convenience method (keeps old callers working) - returns bool to indicate success/failure
        Task<bool> SendEmailAsync(string toEmail, string subject, string htmlMessage, CancellationToken cancellationToken = default);
    }
}