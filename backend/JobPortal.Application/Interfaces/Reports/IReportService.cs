using JobPortal.Application.DTOs.Reports;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JobPortal.Application.Interfaces.Reports
{
    public interface IReportService
    {
        Task<ReportDto> CreateReportAsync(int reporterId, CreateReportDto dto);
        Task<IEnumerable<ReportDto>> GetReportsByReporterAsync(int reporterId);
        Task<IEnumerable<ReportDto>> GetAllReportsForAdminAsync();
        Task<ReportDto?> GetReportByIdAsync(int id);
        Task<bool> ReviewReportAsync(int reportId, int adminId, UpdateReportStatusDto dto);
        Task<bool> RejectReportAsync(int reportId, int adminId, UpdateReportStatusDto dto);
        Task<bool> ResolveReportAsync(int reportId, int adminId, UpdateReportStatusDto dto);
    }
}
