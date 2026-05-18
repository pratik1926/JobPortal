import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { SectionHeader }
from "../../ui/SectionHeader";

export default function JobsReportSection({
  jobsPreview,
  downloadJobsReport
}) {
  return (
    <Card className="p-6">

      <SectionHeader
        title="Jobs Report Preview"
        actions={
            <Button
            onClick={
                downloadJobsReport
            }
            >
            Export Excel
            </Button>
        }
        />

      <div className="overflow-x-auto">

        <table className="
          min-w-full
          border
        ">

          <thead className="bg-gray-100">

            <tr>

              <th className="border p-3">
                Job
              </th>

              <th className="border p-3">
                Location
              </th>

              <th className="border p-3">
                Budget
              </th>

              <th className="border p-3">
                Total Apps
              </th>

              <th className="border p-3">
                Approved
              </th>

              <th className="border p-3">
                Rejected
              </th>

            </tr>

          </thead>

          <tbody>

            {jobsPreview.map(
              (job) => (
                <tr
                  key={job.jobId}
                >
                  <td className="border p-3">
                    {job.jobTitle}
                  </td>

                  <td className="border p-3">
                    {job.location}
                  </td>

                  <td className="border p-3">
                    {job.budget}
                  </td>

                  <td className="border p-3">
                    {
                      job.totalApplications
                    }
                  </td>

                  <td className="border p-3">
                    {
                      job.approvedApplications
                    }
                  </td>

                  <td className="border p-3">
                    {
                      job.rejectedApplications
                    }
                  </td>
                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </Card>
  );
}