public interface IVerificationService
{
    Task SendCodeAsync(string email);
    Task<bool> VerifyCodeAsync(string email, string code);
}