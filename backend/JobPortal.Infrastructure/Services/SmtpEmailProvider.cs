using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using JobPortal.Application.DTOs.Email;
using JobPortal.Application.Interfaces;
using JobPortal.Application.Settings;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;

namespace JobPortal.Infrastructure.Services
{
    public class SmtpEmailProvider : ISmtpEmailProvider
    {
        private readonly EmailSettings _settings;
        private readonly ILogger<SmtpEmailProvider> _logger;

        public SmtpEmailProvider(IOptions<EmailSettings> options, ILogger<SmtpEmailProvider> logger)
        {
            _settings = options?.Value ?? throw new ArgumentNullException(nameof(options));
            _logger = logger;
        }

        public async Task SendAsync(EmailMessageDto message, CancellationToken cancellationToken = default)
        {
            var email = new MimeMessage();
            var fromEmail = !string.IsNullOrEmpty(message.FromEmail) ? message.FromEmail : _settings.FromEmail;
            var fromName = !string.IsNullOrEmpty(message.FromName) ? message.FromName : _settings.FromName;
            email.From.Add(new MailboxAddress(fromName, fromEmail));
            email.To.Add(new MailboxAddress(message.ToName ?? string.Empty, message.ToEmail));
            email.Subject = message.Subject ?? string.Empty;

            var builder = new BodyBuilder();

            if (!string.IsNullOrEmpty(message.HtmlBody))
                builder.HtmlBody = message.HtmlBody;
            if (!string.IsNullOrEmpty(message.PlainTextBody))
                builder.TextBody = message.PlainTextBody;

            if (message.Attachments?.Any() == true)
            {
                foreach (var att in message.Attachments)
                {
                    if (att?.Content == null || att.Content.Length == 0) continue;
                    if (att.Content.Length > _settings.MaxAttachmentSizeBytes)
                    {
                        _logger.LogWarning("Skipping large attachment {FileName} for {To}", att.FileName, message.ToEmail);
                        continue;
                    }
                    if (_settings.AllowedAttachmentMimeTypes?.Any() == true &&
                        !string.IsNullOrEmpty(att.ContentType) &&
                        !_settings.AllowedAttachmentMimeTypes.Contains(att.ContentType, StringComparer.OrdinalIgnoreCase))
                    {
                        _logger.LogWarning("Skipping disallowed mime {Mime} for {FileName}", att.ContentType, att.FileName);
                        continue;
                    }

                    builder.Attachments.Add(att.FileName, att.Content, ContentType.Parse(att.ContentType ?? "application/octet-stream"));
                }
            }

            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            try
            {
                var socketOptions = _settings.UseSsl ? SecureSocketOptions.SslOnConnect :
                    _settings.UseStartTls ? SecureSocketOptions.StartTls : SecureSocketOptions.StartTlsWhenAvailable;

                await smtp.ConnectAsync(_settings.SmtpServer, _settings.SmtpPort, socketOptions, cancellationToken);

                if (!string.IsNullOrWhiteSpace(_settings.Username))
                {
                    await smtp.AuthenticateAsync(_settings.Username, _settings.Password, cancellationToken);
                }

                await smtp.SendAsync(email, cancellationToken);
                _logger.LogInformation("SMTP sent email to {To}", message.ToEmail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SMTP send failed to {To}", message.ToEmail);
                throw;
            }
            finally
            {
                try
                {
                    if (smtp.IsConnected)
                        await smtp.DisconnectAsync(true, cancellationToken);
                }
                catch (Exception ex)
                {
                    _logger.LogDebug(ex, "Error disconnecting SMTP client");
                }
            }
        }
    }
}