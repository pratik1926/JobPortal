import { Card } from "../../../components/ui/Card";
import ReportCard from "../components/ReportCard";
import { SectionHeader }
from "../../../components/ui/SectionHeader";

export default function ReportingCenter({
  downloadFile,
  downloadJobsReport,
  exportSystemReport,
  exportUsersReport,
  exportModerationReport,
  exportCategoriesReport,
  exportTimelineReport
}) {
  return (
    <Card className="p-6">

      <SectionHeader
        title="Reporting Center"
        description="
            Export analytics and moderation reports
        "
        />

      <div className="
        grid
        grid-cols-1
        gap-4
        md:grid-cols-2
        lg:grid-cols-3
      ">

        <ReportCard
          title="Full System Report"
          description="
            Multi-sheet export with jobs,
            users, analytics and moderation
          "
          color="bg-blue-600"
          onClick={() =>
            downloadFile(
              exportSystemReport,
              "system-report.xlsx",
              "System report downloaded"
            )
          }
        />

        <ReportCard
          title="Users Report"
          description="
            Export users, roles and
            account statuses
          "
          color="bg-green-600"
          onClick={() =>
            downloadFile(
              exportUsersReport,
              "users-report.xlsx",
              "Users report downloaded"
            )
          }
        />

        <ReportCard
          title="Jobs Report"
          description="
            Export jobs with applications
            and provider analytics
          "
          color="bg-purple-600"
          onClick={
            downloadJobsReport
          }
        />

        <ReportCard
          title="Moderation Report"
          description="
            Export moderation and
            enforcement analytics
          "
          color="bg-red-600"
          onClick={() =>
            downloadFile(
              exportModerationReport,
              "moderation-report.xlsx",
              "Moderation report downloaded"
            )
          }
        />

        <ReportCard
          title="Report Categories"
          description="
            Export grouped report reasons
            and complaint categories
          "
          color="bg-pink-600"
          onClick={() =>
            downloadFile(
              exportCategoriesReport,
              "report-categories.xlsx",
              "Categories report downloaded"
            )
          }
        />

        <ReportCard
          title="Reports Timeline"
          description="
            Export reports submitted
            over time
          "
          color="bg-cyan-600"
          onClick={() =>
            downloadFile(
              exportTimelineReport,
              "reports-timeline.xlsx",
              "Timeline report downloaded"
            )
          }
        />

      </div>

    </Card>
  );
}