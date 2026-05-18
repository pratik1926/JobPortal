import { Users } from "lucide-react";
import { Card } from "../../ui/Card";
import StatCard from "../StatCard";
import { SectionHeader }
from "../../ui/SectionHeader";

export default function ModerationSection({
  analytics
}) {
  if (!analytics) return null;

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <StatCard
          title="Total Reports"
          value={analytics.totalReports}
          icon={<Users />}
        />

        <StatCard
          title="Pending Reports"
          value={analytics.pendingReports}
          icon={<Users />}
        />

        <StatCard
          title="Rejected Reports"
          value={analytics.rejectedReports}
          icon={<Users />}
        />

        <StatCard
          title="Action Taken"
          value={
            analytics.actionTakenReports
          }
          icon={<Users />}
        />

      </div>

      <Card className="p-6">

        <SectionHeader
  title="Top Report Reasons"
/>

        <div className="space-y-3">

          {analytics.topReportReasons?.map(
            (r, i) => (
              <div
                key={i}
                className="
                  flex
                  justify-between
                  border-b
                  pb-2
                "
              >
                <span>
                  {r.reason}
                </span>

                <span className="font-semibold">
                  {r.count}
                </span>
              </div>
            )
          )}

        </div>

      </Card>

      <Card className="p-6">

        <SectionHeader
  title="Reports Over Time"
/>

        <div className="space-y-2">

          {analytics.reportsPerDay?.map(
            (r, i) => (
              <div
                key={i}
                className="
                  flex
                  justify-between
                  border-b
                  pb-2
                "
              >
                <span>
                  {new Date(r.date)
                    .toLocaleDateString()}
                </span>

                <span className="font-semibold">
                  {r.count}
                </span>
              </div>
            )
          )}

        </div>

      </Card>

    </div>
  );
}