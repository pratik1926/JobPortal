//using JobPortal.Application.DTOs;

//namespace JobPortal.Application.Interfaces
//{
//    public interface IApplicationService
//    {
//        Task ApplyToJobAsync(int jobId, int seekerId, ApplyJobDto dto);

//        Task<IEnumerable<JobPortal.Domain.Entities.Application>> GetMyApplicationsAsync(int seekerId);

//        Task<IEnumerable<JobPortal.Domain.Entities.Application>> GetApplicationsForProviderAsync(int providerId);

//        Task UpdateApplicationStatusAsync(int applicationId, string status, int providerId);

//        Task<bool> HasUserApplied(int jobId, int userId);
//    }
//}


//using JobPortal.Application.DTOs;

//namespace JobPortal.Application.Interfaces
//{
//    public interface IApplicationService
//    {
//        Task ApplyToJobAsync(int jobId, int seekerId, ApplyJobDto dto);

//        Task<IEnumerable<JobPortal.Domain.Entities.Application>> GetMyApplicationsAsync(int seekerId);

//        Task<IEnumerable<JobPortal.Domain.Entities.Application>> GetApplicationsForProviderAsync(int providerId);

//        Task UpdateApplicationStatusAsync(int applicationId, string status, int providerId);

//        Task<bool> HasUserApplied(int jobId, int userId);
//    }
//}

using JobPortal.Application.DTOs.Applications;

namespace JobPortal.Application.Interfaces.Applications
{
    public interface IApplicationService
    {
        Task ApplyToJobAsync(int jobId, int seekerId, ApplyJobDto dto);

        // 🔥 FIXED: return DTO (not entity)
        Task<IEnumerable<MyApplicationDto>> GetMyApplicationsAsync(int seekerId);

        //Task<IEnumerable<ApplicationProviderDto>> GetApplicationsForProviderAsync(int providerId);

        Task<(List<ApplicationProviderDto> applications, int total)>
GetPagedApplicationsForProviderAsync(int providerId, int page, int pageSize);

        Task UpdateApplicationStatusAsync(int applicationId, string status, int providerId);

        Task<bool> HasUserApplied(int jobId, int userId);

        Task<(List<ApplicationProviderDto> applications, int total)>
GetPagedApplicationsForSeekerAsync(int seekerId, int page, int pageSize);
    }
}