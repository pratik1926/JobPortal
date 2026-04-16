using JobPortal.Application.Interfaces;
using JobPortal.Domain.Entities;
using ApplicationEntity = JobPortal.Domain.Entities.Application;
namespace JobPortal.Application.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IJobRepository _jobRepository;

        public ApplicationService(IJobRepository jobRepository)
        {
            _jobRepository = jobRepository;
        }

        public async Task ApplyToJobAsync(int jobId, int seekerId)
        {
            var application = new ApplicationEntity
            {
                JobId = jobId,
                SeekerId = seekerId
            };

            await _jobRepository.ApplyToJobAsync(application);
        }

        public async Task<IEnumerable<ApplicationEntity>> GetMyApplicationsAsync(int seekerId)
        {
            var apps = await _jobRepository.GetApplicationsBySeekerIdAsync(seekerId);
            return apps.Where(a => a.SeekerId == seekerId);
        }

        public async Task<IEnumerable<ApplicationEntity>> GetApplicationsForProviderAsync(int providerId)
        {
            return await _jobRepository.GetApplicationsByProviderIdAsync(providerId);
        }

        public async Task UpdateApplicationStatusAsync(int applicationId, string status, int providerId)
        {
            var apps = await _jobRepository.GetApplicationsByProviderIdAsync(providerId);

            var app = apps.FirstOrDefault(a => a.Id == applicationId);

            if (app == null)
                throw new UnauthorizedAccessException("You are not allowed to update this application");

            await _jobRepository.UpdateApplicationStatusAsync(applicationId, status);
        }
    }
}