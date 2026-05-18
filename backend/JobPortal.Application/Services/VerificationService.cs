using JobPortal.Application.Interfaces.Email;
using JobPortal.Domain.Entities;

namespace JobPortal.Application.Services
{
    public class VerificationService : IVerificationService
    {
        private readonly IEmailService _emailService;
        private readonly IEmailVerificationRepository _repository;

        private readonly TimeSpan _expiry = TimeSpan.FromMinutes(5);

        public VerificationService(
            IEmailService emailService,
            IEmailVerificationRepository repository)
        {
            _emailService = emailService;
            _repository = repository;
        }

        public async Task SendCodeAsync(string email)
        {
            email = email.ToLower();

            var code = new Random().Next(100000, 999999).ToString();

            // ✅ remove old OTPs via repository
            await _repository.RemoveByEmailAsync(email);

            var verification = new EmailVerification
            {
                Email = email,
                Code = code,
                CreatedAt = DateTime.UtcNow,
                Expiry = DateTime.UtcNow.Add(_expiry)
            };

            // ✅ save via repository
            await _repository.AddAsync(verification);
            await _repository.SaveChangesAsync();

            //// ✅ send email
            //await _emailService.SendEmailAsync(
            //    email,
            //    "Your Verification Code",
            //    $"Your OTP is: <b>{code}</b>"
            //);

            await _emailService.SendTemplateAsync(
                email,
                email,
                "Your Verification Code",
                "OtpVerification",
                new { Code = code }
            );
        }

        public async Task<bool> VerifyCodeAsync(string email, string code)
        {
            email = email.ToLower();

            var record = await _repository.GetLatestByEmailAsync(email);

            if (record == null) return false;
            if (record.Expiry < DateTime.UtcNow) return false;
            if (record.Code != code) return false;

            record.IsVerified = true;

            // ✅ persist change
            await _repository.SaveChangesAsync();

            return true;
        }
    }
}