using JobPortal.Domain.Entities;

namespace JobPortal.Application.Interfaces.Verification
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(User user);

        string GenerateRefreshToken();

    }
}