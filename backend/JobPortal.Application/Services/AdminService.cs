using JobPortal.Application.Interfaces;
using JobPortal.Domain.Entities;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using JobPortal.Application.DTOs.Reports;

namespace JobPortal.Application.Services
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJobRepository _jobRepository;
        private readonly IReportRepository _reportRepository;


        public AdminService(IUserRepository userRepository, IJobRepository jobRepository, IReportRepository reportRepository)
        {
            _userRepository = userRepository;
            _jobRepository = jobRepository;
            _reportRepository = reportRepository;

        }

        public async Task<object> GetAnalyticsAsync()
        {
            var users = await _userRepository.GetAllUsersAsync();
            List<Job> jobs = (await _jobRepository.GetAllJobsAsync()).ToList();
            var reports = await _reportRepository.GetAllReportsAsync();

            var totalUsers = users.Count;
            var bannedUsers = users.Count(u => u.IsBanned);
            var activeUsers = totalUsers - bannedUsers;

            var seekers = users.Count(u => u.Role == "Seeker");
            var providers = users.Count(u => u.Role == "Provider");

            var totalJobs = jobs.Count;

            var jobsPerDay = jobs
                .GroupBy(j => j.CreatedAt.Date)
                .Select(g => new
                {
                    date = g.Key,
                    count = g.Count()
                })
                .OrderBy(x => x.date);

            //  REPORT ANALYTICS
            var totalReports = reports.Count();

            var pendingReports =
                reports.Count(r => r.Status == "Pending");

            var rejectedReports =
                reports.Count(r => r.Status == "Rejected");

            var actionTakenReports =
                reports.Count(r =>
                    r.Status == "Resolved" ||
                    r.Status == "ActionTaken"
                );

            //  REPORTS OVER TIME
            var reportsPerDay = reports
                .GroupBy(r => r.CreatedAt.Date)
                .Select(g => new
                {
                    date = g.Key,
                    count = g.Count()
                })
                .OrderBy(x => x.date);

            //  TOP REPORT REASONS
            var topReportReasons = reports
                .GroupBy(r => r.Reason)
                .Select(g => new
                {
                    reason = g.Key,
                    count = g.Count()
                })
                .OrderByDescending(x => x.count)
                .Take(5);


            return new
            {
                totalUsers,
                activeUsers,
                bannedUsers,
                seekers,
                providers,
                totalJobs,
                jobsPerDay,

                // REPORTS
                totalReports,
                pendingReports,
                rejectedReports,
                actionTakenReports,
                reportsPerDay,
                topReportReasons
            };
        }

        public async Task<byte[]> ExportJobsReportAsync()
        {
            ExcelPackage.License
                .SetNonCommercialPersonal("Pratik");

            //  FETCH DATA
            var jobs =
                (await _jobRepository
                .GetAllJobsAsync())
                .ToList();

            var applications =
                (await _jobRepository
                .GetAllApplicationsAsync())
                .ToList();

            //  CREATE EXCEL PACKAGE
            using var package =
                new ExcelPackage();

            //  CREATE WORKSHEET
            var worksheet =
                package.Workbook.Worksheets
                .Add("Jobs Report");

            //  HEADERS
            worksheet.Cells[1, 1].Value = "JobId";
            worksheet.Cells[1, 2].Value = "JobTitle";
            worksheet.Cells[1, 3].Value = "Location";
            worksheet.Cells[1, 4].Value = "Budget";
            worksheet.Cells[1, 5].Value = "ProviderId";
            worksheet.Cells[1, 6].Value = "TotalApplications";
            worksheet.Cells[1, 7].Value = "ApprovedApplications";
            worksheet.Cells[1, 8].Value = "RejectedApplications";
            worksheet.Cells[1, 9].Value = "CreatedDate";

            //  HEADER STYLING
            using (var range =
                worksheet.Cells[1, 1, 1, 9])
            {
                range.Style.Font.Bold = true;

                range.Style.Fill.PatternType =
                    ExcelFillStyle.Solid;

                range.Style.Fill.BackgroundColor
                    .SetColor(Color.LightBlue);
            }

            int row = 2;

            //ADD DATA ROWS
            foreach (var job in jobs)
            {
                var jobApplications =
                    applications.Where(a =>
                        a.JobId == job.Id)
                    .ToList();

                var totalApplications =
                    jobApplications.Count;

                var approvedApplications =
                    jobApplications.Count(a =>
                        a.Status == "Approved");

                var rejectedApplications =
                    jobApplications.Count(a =>
                        a.Status == "Rejected");

                worksheet.Cells[row, 1].Value =
                    job.Id;

                worksheet.Cells[row, 2].Value =
                    job.Title;

                worksheet.Cells[row, 3].Value =
                    job.Location;

                worksheet.Cells[row, 4].Value =
                    job.Budget;

                worksheet.Cells[row, 5].Value =
                    job.ProviderId;

                worksheet.Cells[row, 6].Value =
                    totalApplications;

                worksheet.Cells[row, 7].Value =
                    approvedApplications;

                worksheet.Cells[row, 8].Value =
                    rejectedApplications;

                worksheet.Cells[row, 9].Value =
                    job.CreatedAt;

                worksheet.Cells[row, 9]
                    .Style.Numberformat.Format =
                        "yyyy-mm-dd hh:mm:ss";

                row++;
            }

            // AUTO FIT COLUMNS
            worksheet.Cells.AutoFitColumns();

            // CREATE REPORTS FOLDER
            var reportsFolder =
                Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "Reports"
                );

            if (!Directory.Exists(reportsFolder))
            {
                Directory.CreateDirectory(
                    reportsFolder
                );
            }

            // FILE PATH
            var filePath =
                Path.Combine(
                    reportsFolder,
                    "jobs-report.xlsx"
                );

            // GENERATE EXCEL BYTES
            var bytes =
                package.GetAsByteArray();

            // SAVE FILE PHYSICALLY
            await File.WriteAllBytesAsync(
                filePath,
                bytes
            );

            // RETURN FILE BYTES
            return bytes;
        }

        public async Task<List<JobReportPreviewDto>>
GetJobsReportPreviewAsync()
        {
            var jobs =
                (await _jobRepository
                .GetAllJobsAsync())
                .ToList();

            var applications =
                (await _jobRepository
                .GetAllApplicationsAsync())
                .ToList();

            var result =
                jobs.Select(job =>
                {
                    var jobApplications =
                        applications.Where(a =>
                            a.JobId == job.Id)
                        .ToList();

                    return new JobReportPreviewDto
                    {
                        JobId = job.Id,

                        JobTitle = job.Title,

                        Location = job.Location,

                        Budget = job.Budget,

                        ProviderId = job.ProviderId,

                        TotalApplications =
                            jobApplications.Count,

                        ApprovedApplications =
                            jobApplications.Count(a =>
                                a.Status == "Approved"),

                        RejectedApplications =
                            jobApplications.Count(a =>
                                a.Status == "Rejected"),

                        CreatedDate =
                            job.CreatedAt
                    };
                }).ToList();

            return result;
        }
    }
}