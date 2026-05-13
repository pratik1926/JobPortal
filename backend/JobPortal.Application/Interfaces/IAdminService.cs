//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using JobPortal.Application.DTOs.Reports;

//namespace JobPortal.Application.Interfaces
//{
//    public interface IAdminService
//    {
//        Task<object> GetAnalyticsAsync();

//        Task<byte[]> ExportSystemReportAsync();
//        Task<List<JobReportPreviewDto>>GetJobsReportPreviewAsync();
//    }
//}


using JobPortal.Application.DTOs.Reports;

namespace JobPortal.Application.Interfaces
{
    public interface IAdminService
    {
        Task<object> GetAnalyticsAsync();

        // MASTER EXPORT
        Task<byte[]> ExportSystemReportAsync();

        // INDIVIDUAL EXPORTS
        Task<byte[]> ExportJobsReportAsync();

        Task<byte[]> ExportUsersReportAsync();

        Task<byte[]> ExportAnalyticsReportAsync();

        Task<byte[]> ExportModerationReportAsync();

        Task<byte[]> ExportReportCategoriesAsync();

        Task<byte[]> ExportReportsTimelineAsync();

        Task<List<JobReportPreviewDto>>
            GetJobsReportPreviewAsync();
    }
}