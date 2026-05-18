using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Hosting;
using RazorLight;
using JobPortal.Application.Interfaces.Email;

namespace JobPortal.Infrastructure.Services
{
    public class EmailTemplateRenderer : IEmailTemplateRenderer
    {
        private readonly RazorLightEngine _engine;
        private readonly ILogger<EmailTemplateRenderer> _logger;

        public EmailTemplateRenderer(IHostEnvironment env, ILogger<EmailTemplateRenderer> logger)
        {
            _logger = logger;

            // Templates placed in Infrastructure/Email/Templates (copy these HTML files there)
            var templatesPath = Path.Combine(env.ContentRootPath, "Infrastructure", "Email", "Templates");

            _engine = new RazorLightEngineBuilder()
                .UseFileSystemProject(templatesPath)
                .UseMemoryCachingProvider()
                .Build();
        }

        public async Task<string> RenderHtmlAsync<TModel>(string templateKey, TModel model, CancellationToken cancellationToken = default)
        {
            try
            {
                var result = await _engine.CompileRenderAsync($"{templateKey}.cshtml", model);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to render email template {TemplateKey}", templateKey);
                throw;
            }
        }

        public async Task<string?> RenderPlainTextAsync<TModel>(string templateKey, TModel model, CancellationToken cancellationToken = default)
        {
            // Optional: you can implement separate plain text templates or strip HTML.
            try
            {
                // Attempt to render plain text template
                var plainPath = $"{templateKey}.txt";
                // If file exists, render, else return null (so fallback to HTML)
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Plain text render failed for {TemplateKey}", templateKey);
                return null;
            }
        }
    }
}