using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JobPortal.Domain.Entities;

namespace JobPortal.Application.Interfaces
{
    public interface IJobRepository
    {
        Task<List<Job>> GetAllJobsAsync();
        Task<Job?> GetJobByIdAsync(int id);
        Task AddJobAsync(Job job);
    }
}
