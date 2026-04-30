using JobPortal.Application.DTOs;
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
    }
}