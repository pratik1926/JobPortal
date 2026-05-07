using JobPortal.Domain.Entities;

namespace JobPortal.Application.Interfaces
{
    public interface IReportRepository
    {
        Task<Report> CreateReportAsync(Report report);
        Task<Report?> GetReportByIdAsync(int id);
        Task<IEnumerable<Report>> GetReportsByReporterIdAsync(int reporterId);
        Task<IEnumerable<Report>> GetAllReportsAsync();
        Task<bool> ReportExistsForApplicationByReporterAsync(int applicationId, int reporterId);
        Task<bool> UpdateReportAsync(Report report);
    }
}