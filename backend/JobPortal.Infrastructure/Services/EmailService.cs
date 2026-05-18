//using MailKit.Net.Smtp;
//using MailKit.Security;
//using MimeKit;
//using Microsoft.Extensions.Configuration;
//using JobPortal.Application.Interfaces;

//namespace JobPortal.Infrastructure.Services
//{
//    public class EmailService : IEmailService
//    {
//        private readonly IConfiguration _configuration;

//        public EmailService(IConfiguration configuration)
//        {
//            _configuration = configuration;
//        }

//        public async Task SendEmailAsync(string toEmail, string subject, string message)
//        {
//            var email = new MimeMessage();

//            email.From.Add(new MailboxAddress("Job Portal", _configuration["EmailSettings:FromEmail"]));
//            email.To.Add(new MailboxAddress("", toEmail));
//            email.Subject = subject;

//            email.Body = new TextPart("html")
//            {
//                Text = message
//            };

//            using var smtp = new SmtpClient();

//            await smtp.ConnectAsync(
//                _configuration["EmailSettings:SmtpServer"],
//                int.Parse(_configuration["EmailSettings:SmtpPort"]),
//                SecureSocketOptions.StartTls
//            );

//            await smtp.AuthenticateAsync(
//                _configuration["EmailSettings:Username"],
//                _configuration["EmailSettings:Password"]
//            );

//            await smtp.SendAsync(email);
//            await smtp.DisconnectAsync(true);
//        }
//    }
//}

using System;
using System.Threading;
using System.Threading.Tasks;
using JobPortal.Application.DTOs.Email;
using JobPortal.Application.Interfaces.Email;
using Microsoft.Extensions.Logging;

namespace JobPortal.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly ISmtpEmailProvider _provider;
        private readonly IEmailTemplateRenderer _renderer;
        private readonly ILogger<EmailService> _logger;

        public EmailService(ISmtpEmailProvider provider, IEmailTemplateRenderer renderer, ILogger<EmailService> logger)
        {
            _provider = provider ?? throw new ArgumentNullException(nameof(provider));
            _renderer = renderer ?? throw new ArgumentNullException(nameof(renderer));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<bool> SendAsync(EmailMessageDto message, CancellationToken cancellationToken = default)
        {
            try
            {
                await _provider.SendAsync(message, cancellationToken);
                _logger.LogInformation("EmailService: sent to {To}", message.ToEmail);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EmailService: failed to send to {To}", message.ToEmail);
                return false;
            }
        }

        public async Task<bool> SendTemplateAsync<TModel>(string toEmail, string toName, string subject, string templateKey, TModel model, CancellationToken cancellationToken = default)
        {
            try
            {
                var html = await _renderer.RenderHtmlAsync(templateKey, model, cancellationToken);
                var plain = await _renderer.RenderPlainTextAsync(templateKey, model, cancellationToken);

                var msg = new EmailMessageDto
                {
                    ToEmail = toEmail,
                    ToName = toName,
                    Subject = subject,
                    HtmlBody = html,
                    PlainTextBody = plain
                };

                return await SendAsync(msg, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SendTemplateAsync failed for {TemplateKey} to {To}", templateKey, toEmail);
                return false;
            }
        }

        // Back-compat: keep simple signature used previously
        public async Task<bool> SendEmailAsync(string toEmail, string subject, string htmlMessage, CancellationToken cancellationToken = default)
        {
            var msg = new EmailMessageDto
            {
                ToEmail = toEmail,
                Subject = subject,
                HtmlBody = htmlMessage
            };
            return await SendAsync(msg, cancellationToken);
        }
    }
}