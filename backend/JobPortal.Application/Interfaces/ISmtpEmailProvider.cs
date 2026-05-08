using JobPortal.Application.DTOs.Email;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JobPortal.Application.Interfaces
{
    public interface ISmtpEmailProvider
    {
        Task SendAsync(EmailMessageDto message, CancellationToken cancellationToken = default);
    }
}
