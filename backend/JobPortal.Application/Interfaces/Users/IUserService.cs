using JobPortal.Application.DTOs.Users;
using JobPortal.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JobPortal.Application.Interfaces.Users
{
    public interface IUserService
    {
        Task<User?> GetUserByIdAsync(int userId);

        Task<(List<UserAdminDto> users, int total)> GetPagedUsersAsync(int page, int pageSize);
        Task<bool> BanUserAsync(int id);
        Task<bool> UnbanUserAsync(int id);
        Task<bool> DeleteUserAsync(int id);

        Task<UserProfileDto> GetProfileAsync(int userId);

        Task ChangePasswordAsync(int userId, ChangePasswordDto dto);
    }
}
