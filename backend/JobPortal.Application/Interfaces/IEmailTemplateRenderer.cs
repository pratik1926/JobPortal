using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JobPortal.Application.Interfaces
{
    public interface IEmailTemplateRenderer
    {
        Task<string> RenderHtmlAsync<TModel>(string templateKey, TModel model, CancellationToken cancellationToken = default);
        Task<string?> RenderPlainTextAsync<TModel>(string templateKey, TModel model, CancellationToken cancellationToken = default);
    }
}
