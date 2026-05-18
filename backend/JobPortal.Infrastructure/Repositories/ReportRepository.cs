using JobPortal.Application.Interfaces.Reports;
using JobPortal.Domain.Entities;
using JobPortal.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace JobPortal.Infrastructure.Repositories
{
    public class ReportRepository : IReportRepository
    {
        private readonly JobPortalDbContext _context;

        public ReportRepository(JobPortalDbContext context)
        {
            _context = context;
        }

        public async Task<Report?> GetByIdAsync(int id)
        {
            return await _context.Reports
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<Report> CreateReportAsync(Report report)
        {
            await _context.Reports.AddAsync(report);
            await _context.SaveChangesAsync();
            return report;
        }

        public async Task<Report?> GetReportByIdAsync(int id)
        {
            return await _context.Reports
                .Include(r => r.Application)
                .Include(r => r.Reporter)
                .Include(r => r.ReportedUser)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<IEnumerable<Report>> GetReportsByReporterIdAsync(int reporterId)
        {
            return await _context.Reports
                .Include(r => r.Application)
                .Include(r => r.Reporter)
                .Include(r => r.ReportedUser)
                .Where(r => r.ReporterId == reporterId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Report>> GetAllReportsAsync()
        {
            return await _context.Reports
                .Include(r => r.Application)
                .Include(r => r.Reporter)
                .Include(r => r.ReportedUser)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<bool> ReportExistsForApplicationByReporterAsync(int applicationId, int reporterId)
        {
            return await _context.Reports.AnyAsync(r => r.ApplicationId == applicationId && r.ReporterId == reporterId);
        }

        public async Task<bool> UpdateReportAsync(Report report)
        {
            _context.Reports.Update(report);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}