using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JobPortal.Domain.Entities;

namespace JobPortal.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<User> RegisterUserAsync(User user);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByRefreshTokenAsync(string refreshToken);
        Task UpdateUserAsync(User user);
        Task<List<User>> GetAllUsersAsync();
        Task<bool> DeleteUserAsync(int id);
        Task<bool> BanUserAsync(int id);
        Task<bool> UnbanUserAsync(int id);
        Task<User?> GetUserByIdAsync(int userId);
        Task<(List<User> users, int total)> GetPagedUsersAsync(int page, int pageSize);

    }
}
