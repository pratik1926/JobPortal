using JobPortal.Application.Interfaces;
using JobPortal.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JobPortal.Application.Services
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJobRepository _jobRepository;

        public AdminService(IUserRepository userRepository, IJobRepository jobRepository)
        {
            _userRepository = userRepository;
            _jobRepository = jobRepository;
        }

        public async Task<object> GetAnalyticsAsync()
        {
            var users = await _userRepository.GetAllUsersAsync();
            List<Job> jobs = (await _jobRepository.GetAllJobsAsync()).ToList();

            var totalUsers = users.Count;
            var bannedUsers = users.Count(u => u.IsBanned);
            var activeUsers = totalUsers - bannedUsers;

            var seekers = users.Count(u => u.Role == "Seeker");
            var providers = users.Count(u => u.Role == "Provider");

            var totalJobs = jobs.Count;

            var jobsPerDay = jobs
                .GroupBy(j => j.CreatedAt.Date)
                .Select(g => new {
                    date = g.Key,
                    count = g.Count()
                })
                .OrderBy(x => x.date);


            return new
            {
                totalUsers,
                activeUsers,
                bannedUsers,
                seekers,
                providers,
                totalJobs,
                jobsPerDay
            };
        }
    }
}
