using JobPortal.Domain.Entities;

namespace JobPortal.Application.Interfaces
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(User user);
    }
}