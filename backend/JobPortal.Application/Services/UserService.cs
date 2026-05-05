using JobPortal.Application.DTOs;
using JobPortal.Application.Exceptions;
using JobPortal.Application.Interfaces;
using JobPortal.Domain.Entities;

namespace JobPortal.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<User?> GetUserByIdAsync(int userId)
        {
            return await _userRepository.GetUserByIdAsync(userId);
        }

        public async Task<(List<UserAdminDto> users, int total)> GetPagedUsersAsync(int page, int pageSize)
        {
            var (users, total) = await _userRepository.GetPagedUsersAsync(page, pageSize);

            var result = users.Select(u => new UserAdminDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role,
                IsBanned = u.IsBanned
            }).ToList();

            return (result, total);
        }

        public async Task<bool> BanUserAsync(int id)
        {
            return await _userRepository.BanUserAsync(id);
        }

        public async Task<bool> UnbanUserAsync(int id)
        {
            return await _userRepository.UnbanUserAsync(id);
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            return await _userRepository.DeleteUserAsync(id);
        }

        public async Task<UserProfileDto> GetProfileAsync(int userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);

            if (user == null)
                throw new NotFoundException("User not found");

            return new UserProfileDto
            {
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            };
        }

        public async Task ChangePasswordAsync(int userId, ChangePasswordDto dto)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);

            if (user == null)
                throw new NotFoundException("User not found");

            // 🔥 VERIFY CURRENT PASSWORD
            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
                throw new BadRequestException("Current password is incorrect");

            // 🔥 HASH NEW PASSWORD
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            await _userRepository.UpdateUserAsync(user);
        }
    }
}