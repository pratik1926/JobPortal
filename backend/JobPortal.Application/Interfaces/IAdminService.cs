using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JobPortal.Application.DTOs.Reports;

namespace JobPortal.Application.Interfaces
{
    public interface IAdminService
    {
        Task<object> GetAnalyticsAsync();

        Task<byte[]> ExportJobsReportAsync();
        Task<List<JobReportPreviewDto>>GetJobsReportPreviewAsync();
    }
}
