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

        public async Task<byte[]> ExportSystemReportAsync()
        {
            ExcelPackage.License
                .SetNonCommercialPersonal("Pratik");

            // FETCH DATA
            var users =
                await _userRepository
                    .GetAllUsersAsync();

            var jobs =
                (await _jobRepository
                    .GetAllJobsAsync())
                .ToList();

            var applications =
                (await _jobRepository
                    .GetAllApplicationsAsync())
                .ToList();

            var reports =
                await _reportRepository
                    .GetAllReportsAsync();

            using var package =
                new ExcelPackage();

          

            var jobsSheet =
                package.Workbook.Worksheets
                .Add("Jobs");

            jobsSheet.Cells[1, 1].Value =
                "Job Title";

            jobsSheet.Cells[1, 2].Value =
                "Budget";

            jobsSheet.Cells[1, 3].Value =
                "Location";

            jobsSheet.Cells[1, 4].Value =
                "Provider Name";

            jobsSheet.Cells[1, 5].Value =
                "Applications Received";

            jobsSheet.Cells[1, 6].Value =
                "Created Date";

            using (var range =
                jobsSheet.Cells[1, 1, 1, 6])
            {
                range.Style.Font.Bold = true;

                range.Style.Fill.PatternType =
                    ExcelFillStyle.Solid;

                range.Style.Fill.BackgroundColor
                    .SetColor(Color.DarkBlue);

                range.Style.Font.Color
                    .SetColor(Color.White);
            }

            jobsSheet.View.FreezePanes(2, 1);

            int jobRow = 2;

            foreach (var job in jobs)
            {
                var totalApplications =
                    applications.Count(a =>
                        a.JobId == job.Id);

                jobsSheet.Cells[jobRow, 1].Value =
                    job.Title;

                jobsSheet.Cells[jobRow, 2].Value =
                    job.Budget;

                jobsSheet.Cells[jobRow, 3].Value =
                    job.Location;

                jobsSheet.Cells[jobRow, 4].Value =
                    job.Provider?.Name;

                jobsSheet.Cells[jobRow, 5].Value =
                    totalApplications;

                jobsSheet.Cells[jobRow, 6].Value =
                    job.CreatedAt;

                jobsSheet.Cells[jobRow, 6]
                    .Style.Numberformat.Format =
                        "yyyy-mm-dd HH:mm";

                jobRow++;
            }

            jobsSheet.Cells.AutoFitColumns();

            var usersSheet =
                package.Workbook.Worksheets
                .Add("Users");

            usersSheet.Cells[1, 1].Value =
                "Name";

            usersSheet.Cells[1, 2].Value =
                "Email";

            usersSheet.Cells[1, 3].Value =
                "Role";

            usersSheet.Cells[1, 4].Value =
                "IsBanned";

            using (var range =
                usersSheet.Cells[1, 1, 1, 4])
            {
                range.Style.Font.Bold = true;

                range.Style.Fill.PatternType =
                    ExcelFillStyle.Solid;

                range.Style.Fill.BackgroundColor
                    .SetColor(Color.DarkGreen);

                range.Style.Font.Color
                    .SetColor(Color.White);
            }

            usersSheet.View.FreezePanes(2, 1);

            int userRow = 2;

            foreach (var user in users)
            {
                usersSheet.Cells[userRow, 1].Value =
                    user.Name;

                usersSheet.Cells[userRow, 2].Value =
                    user.Email;

                usersSheet.Cells[userRow, 3].Value =
                    user.Role;

                usersSheet.Cells[userRow, 4].Value =
                    user.IsBanned;

                userRow++;
            }

            usersSheet.Cells.AutoFitColumns();

       
            var analyticsSheet =
                package.Workbook.Worksheets
                .Add("Analytics");

            analyticsSheet.Cells[1, 1].Value =
                "Metric";

            analyticsSheet.Cells[1, 2].Value =
                "Value";

            using (var range =
                analyticsSheet.Cells[1, 1, 1, 2])
            {
                range.Style.Font.Bold = true;

                range.Style.Fill.PatternType =
                    ExcelFillStyle.Solid;

                range.Style.Fill.BackgroundColor
                    .SetColor(Color.DarkOrange);

                range.Style.Font.Color
                    .SetColor(Color.White);
            }

            analyticsSheet.View.FreezePanes(2, 1);

            // ANALYTICS
            var totalUsers = users.Count;

            var bannedUsers =
                users.Count(u => u.IsBanned);

            var activeUsers =
                totalUsers - bannedUsers;

            var seekers =
                users.Count(u =>
                    u.Role == "Seeker");

            var providers =
                users.Count(u =>
                    u.Role == "Provider");

            var totalJobs =
                jobs.Count;

            var totalReports =
                reports.Count();

            var pendingReports =
                reports.Count(r =>
                    r.Status == "Pending");

            var rejectedReports =
                reports.Count(r =>
                    r.Status == "Rejected");

            var actionTakenReports =
                reports.Count(r =>
                    r.Status == "Resolved" ||
                    r.Status == "ActionTaken");

            int analyticsRow = 2;

            analyticsSheet.Cells[analyticsRow, 1].Value =
                "Total Users";

            analyticsSheet.Cells[analyticsRow++, 2].Value =
                totalUsers;

            analyticsSheet.Cells[analyticsRow, 1].Value =
                "Active Users";

            analyticsSheet.Cells[analyticsRow++, 2].Value =
                activeUsers;

            analyticsSheet.Cells[analyticsRow, 1].Value =
                "Banned Users";

            analyticsSheet.Cells[analyticsRow++, 2].Value =
                bannedUsers;

            analyticsSheet.Cells[analyticsRow, 1].Value =
                "Seekers";

            analyticsSheet.Cells[analyticsRow++, 2].Value =
                seekers;

            analyticsSheet.Cells[analyticsRow, 1].Value =
                "Providers";

            analyticsSheet.Cells[analyticsRow++, 2].Value =
                providers;

            analyticsSheet.Cells[analyticsRow, 1].Value =
                "Total Jobs";

            analyticsSheet.Cells[analyticsRow++, 2].Value =
                totalJobs;

            analyticsSheet.Cells[analyticsRow, 1].Value =
                "Total Applications";

            analyticsSheet.Cells[analyticsRow++, 2].Value =
                applications.Count;

            analyticsSheet.Cells[analyticsRow, 1].Value =
                "Total Reports";

            analyticsSheet.Cells[analyticsRow++, 2].Value =
                totalReports;

            analyticsSheet.Cells[analyticsRow, 1].Value =
                "Pending Reports";

            analyticsSheet.Cells[analyticsRow++, 2].Value =
                pendingReports;

            analyticsSheet.Cells[analyticsRow, 1].Value =
                "Rejected Reports";

            analyticsSheet.Cells[analyticsRow++, 2].Value =
                rejectedReports;

            analyticsSheet.Cells[analyticsRow, 1].Value =
                "Resolved Reports";

            analyticsSheet.Cells[analyticsRow++, 2].Value =
                actionTakenReports;

            var avgJobsPerProvider =
                providers == 0
                ? 0
                : (double)totalJobs / providers;

            analyticsSheet.Cells[analyticsRow, 1].Value =
                "Average Jobs Per Provider";

            analyticsSheet.Cells[analyticsRow++, 2].Value =
                Math.Round(avgJobsPerProvider, 2);

            var avgApplicationsPerJob =
                totalJobs == 0
                ? 0
                : (double)applications.Count / totalJobs;

            analyticsSheet.Cells[analyticsRow, 1].Value =
                "Average Applications Per Job";

            analyticsSheet.Cells[analyticsRow++, 2].Value =
                Math.Round(avgApplicationsPerJob, 2);

            analyticsSheet.Cells.AutoFitColumns();

            var moderationSheet =
                package.Workbook.Worksheets
                .Add("Moderation");

            moderationSheet.Cells[1, 1].Value =
                "Report Status";

            moderationSheet.Cells[1, 2].Value =
                "Count";

            using (var range =
                moderationSheet.Cells[1, 1, 1, 2])
            {
                range.Style.Font.Bold = true;

                range.Style.Fill.PatternType =
                    ExcelFillStyle.Solid;

                range.Style.Fill.BackgroundColor
                    .SetColor(Color.DarkRed);

                range.Style.Font.Color
                    .SetColor(Color.White);
            }

            moderationSheet.View.FreezePanes(2, 1);

            moderationSheet.Cells[2, 1].Value =
                "Pending";

            moderationSheet.Cells[2, 2].Value =
                pendingReports;

            moderationSheet.Cells[3, 1].Value =
                "Rejected";

            moderationSheet.Cells[3, 2].Value =
                rejectedReports;

            moderationSheet.Cells[4, 1].Value =
                "Resolved / Action Taken";

            moderationSheet.Cells[4, 2].Value =
                actionTakenReports;

            moderationSheet.Cells.AutoFitColumns();

           

            var categoriesSheet =
                package.Workbook.Worksheets
                .Add("Report Categories");

            categoriesSheet.Cells[1, 1].Value =
                "Report Reason";

            categoriesSheet.Cells[1, 2].Value =
                "Count";

            using (var range =
                categoriesSheet.Cells[1, 1, 1, 2])
            {
                range.Style.Font.Bold = true;

                range.Style.Fill.PatternType =
                    ExcelFillStyle.Solid;

                range.Style.Fill.BackgroundColor
                    .SetColor(Color.Purple);

                range.Style.Font.Color
                    .SetColor(Color.White);
            }

            categoriesSheet.View.FreezePanes(2, 1);

            var topReportReasons =
                reports.GroupBy(r => r.Reason)
                    .Select(g => new
                    {
                        reason = g.Key,
                        count = g.Count()
                    })
                    .OrderByDescending(x => x.count)
                    .Take(10)
                    .ToList();

            int categoryRow = 2;

            foreach (var reason in topReportReasons)
            {
                categoriesSheet.Cells[categoryRow, 1].Value =
                    reason.reason;

                categoriesSheet.Cells[categoryRow, 2].Value =
                    reason.count;

                categoryRow++;
            }

            categoriesSheet.Cells.AutoFitColumns();

        

            var timelineSheet =
                package.Workbook.Worksheets
                .Add("Reports Timeline");

            timelineSheet.Cells[1, 1].Value =
                "Date";

            timelineSheet.Cells[1, 2].Value =
                "Reports Submitted";

            using (var range =
                timelineSheet.Cells[1, 1, 1, 2])
            {
                range.Style.Font.Bold = true;

                range.Style.Fill.PatternType =
                    ExcelFillStyle.Solid;

                range.Style.Fill.BackgroundColor
                    .SetColor(Color.DarkCyan);

                range.Style.Font.Color
                    .SetColor(Color.White);
            }

            timelineSheet.View.FreezePanes(2, 1);

            var reportsPerDay =
                reports.GroupBy(r => r.CreatedAt.Date)
                    .Select(g => new
                    {
                        date = g.Key,
                        count = g.Count()
                    })
                    .OrderBy(x => x.date)
                    .ToList();

            int timelineRow = 2;

            foreach (var item in reportsPerDay)
            {
                timelineSheet.Cells[timelineRow, 1].Value =
                    item.date;

                timelineSheet.Cells[timelineRow, 1]
                    .Style.Numberformat.Format =
                        "yyyy-mm-dd";

                timelineSheet.Cells[timelineRow, 2].Value =
                    item.count;

                timelineRow++;
            }

            timelineSheet.Cells.AutoFitColumns();

            // RETURN FILE
            return package.GetAsByteArray();
        }

        public async Task<byte[]> ExportJobsReportAsync()
        {
            ExcelPackage.License
                .SetNonCommercialPersonal("Pratik");

            var jobs =
                (await _jobRepository
                    .GetAllJobsAsync())
                .ToList();

            var applications =
                (await _jobRepository
                    .GetAllApplicationsAsync())
                .ToList();

            using var package =
                new ExcelPackage();

            var sheet =
                package.Workbook.Worksheets
                .Add("Jobs");

            sheet.Cells[1, 1].Value =
                "Job Title";

            sheet.Cells[1, 2].Value =
                "Budget";

            sheet.Cells[1, 3].Value =
                "Location";

            sheet.Cells[1, 4].Value =
                "Provider Name";

            sheet.Cells[1, 5].Value =
                "Applications Received";

            sheet.Cells[1, 6].Value =
                "Created Date";

            int row = 2;

            foreach (var job in jobs)
            {
                var totalApplications =
                    applications.Count(a =>
                        a.JobId == job.Id);

                sheet.Cells[row, 1].Value =
                    job.Title;

                sheet.Cells[row, 2].Value =
                    job.Budget;

                sheet.Cells[row, 3].Value =
                    job.Location;

                sheet.Cells[row, 4].Value =
                    job.Provider?.Name;

                sheet.Cells[row, 5].Value =
                    totalApplications;

                sheet.Cells[row, 6].Value =
                    job.CreatedAt;

                sheet.Cells[row, 6]
                    .Style.Numberformat.Format =
                        "yyyy-mm-dd HH:mm";

                row++;
            }

            sheet.Cells.AutoFitColumns();

            return package.GetAsByteArray();
        }

        public async Task<byte[]> ExportUsersReportAsync()
        {
            ExcelPackage.License
                .SetNonCommercialPersonal("Pratik");

            var users =
                await _userRepository
                    .GetAllUsersAsync();

            using var package =
                new ExcelPackage();

            var sheet =
                package.Workbook.Worksheets
                .Add("Users");

            sheet.Cells[1, 1].Value =
                "Name";

            sheet.Cells[1, 2].Value =
                "Email";

            sheet.Cells[1, 3].Value =
                "Role";

            sheet.Cells[1, 4].Value =
                "IsBanned";

            int row = 2;

            foreach (var user in users)
            {
                sheet.Cells[row, 1].Value =
                    user.Name;

                sheet.Cells[row, 2].Value =
                    user.Email;

                sheet.Cells[row, 3].Value =
                    user.Role;

                sheet.Cells[row, 4].Value =
                    user.IsBanned;

                row++;
            }

            sheet.Cells.AutoFitColumns();

            return package.GetAsByteArray();
        }

        public async Task<byte[]> ExportModerationReportAsync()
        {
            ExcelPackage.License
                .SetNonCommercialPersonal("Pratik");

            var reports =
                await _reportRepository
                    .GetAllReportsAsync();

            using var package =
                new ExcelPackage();

            var sheet =
                package.Workbook.Worksheets
                .Add("Moderation");

            sheet.Cells[1, 1].Value =
                "Report Status";

            sheet.Cells[1, 2].Value =
                "Count";

            var pending =
                reports.Count(r =>
                    r.Status == "Pending");

            var rejected =
                reports.Count(r =>
                    r.Status == "Rejected");

            var resolved =
                reports.Count(r =>
                    r.Status == "Resolved" ||
                    r.Status == "ActionTaken");

            sheet.Cells[2, 1].Value =
                "Pending";

            sheet.Cells[2, 2].Value =
                pending;

            sheet.Cells[3, 1].Value =
                "Rejected";

            sheet.Cells[3, 2].Value =
                rejected;

            sheet.Cells[4, 1].Value =
                "Resolved";

            sheet.Cells[4, 2].Value =
                resolved;

            sheet.Cells.AutoFitColumns();

            return package.GetAsByteArray();
        }

        public async Task<byte[]> ExportReportCategoriesAsync()
        {
            ExcelPackage.License
                .SetNonCommercialPersonal("Pratik");

            var reports =
                await _reportRepository
                    .GetAllReportsAsync();

            using var package =
                new ExcelPackage();

            var sheet =
                package.Workbook.Worksheets
                .Add("Report Categories");

            sheet.Cells[1, 1].Value =
                "Report Reason";

            sheet.Cells[1, 2].Value =
                "Count";

            var grouped =
                reports.GroupBy(r => r.Reason)
                    .Select(g => new
                    {
                        reason = g.Key,
                        count = g.Count()
                    })
                    .OrderByDescending(x => x.count)
                    .ToList();

            int row = 2;

            foreach (var item in grouped)
            {
                sheet.Cells[row, 1].Value =
                    item.reason;

                sheet.Cells[row, 2].Value =
                    item.count;

                row++;
            }

            sheet.Cells.AutoFitColumns();

            return package.GetAsByteArray();
        }

        public async Task<byte[]> ExportReportsTimelineAsync()
        {
            ExcelPackage.License
                .SetNonCommercialPersonal("Pratik");

            var reports =
                await _reportRepository
                    .GetAllReportsAsync();

            using var package =
                new ExcelPackage();

            var sheet =
                package.Workbook.Worksheets
                .Add("Reports Timeline");

            sheet.Cells[1, 1].Value =
                "Date";

            sheet.Cells[1, 2].Value =
                "Reports Submitted";

            var grouped =
                reports.GroupBy(r => r.CreatedAt.Date)
                    .Select(g => new
                    {
                        date = g.Key,
                        count = g.Count()
                    })
                    .OrderBy(x => x.date)
                    .ToList();

            int row = 2;

            foreach (var item in grouped)
            {
                sheet.Cells[row, 1].Value =
                    item.date;

                sheet.Cells[row, 1]
                    .Style.Numberformat.Format =
                        "yyyy-mm-dd";

                sheet.Cells[row, 2].Value =
                    item.count;

                row++;
            }

            sheet.Cells.AutoFitColumns();

            return package.GetAsByteArray();
        }

        public async Task<byte[]> ExportAnalyticsReportAsync()
        {
            return await ExportSystemReportAsync();
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