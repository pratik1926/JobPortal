import {
  Users,
  Briefcase,
  UserX
} from "lucide-react";

import PieChart, {
  Series,
  Tooltip as PieTooltip,
  Legend,
  Label
} from "devextreme-react/pie-chart";

import Chart, {
  ArgumentAxis,
  ValueAxis,
  Series as LineSeries
} from "devextreme-react/chart";

import { Card} from "../../../components/ui/Card";
import StatCard from "../components/StatCard";
import { SectionHeader } from "../../../components/ui/SectionHeader";

export default function OverviewSection({
  analytics
}) {
  if (!analytics) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <StatCard
          title="Total Users"
          value={analytics.totalUsers}
          icon={<Users />}
        />

        <StatCard
          title="Active Users"
          value={analytics.activeUsers}
          icon={<Users />}
        />

        <StatCard
          title="Banned Users"
          value={analytics.bannedUsers}
          icon={<UserX />}
        />

        <StatCard
          title="Total Jobs"
          value={analytics.totalJobs}
          icon={<Briefcase />}
        />

      </div>

      <Card className="p-6">

        <SectionHeader
  title="User Distribution"
/>

        <PieChart
          dataSource={[
            {
              name: "Seekers",
              value: analytics.seekers
            },
            {
              name: "Providers",
              value: analytics.providers
            }
          ]}
        >
          <Series
            argumentField="name"
            valueField="value"
          >
            <Label
              visible
              customizeText={(point) =>
                `${Math.round(
                  point.percent * 100
                )}%`
              }
            />
          </Series>

          <Legend visible />

          <PieTooltip
            enabled
            customizeTooltip={(arg) => ({
              text:
                `${arg.argumentText}: ${arg.percentText}`
            })}
          />
        </PieChart>

      </Card>

      <Card className="p-6">

        <SectionHeader
  title="Jobs Over Time"
/>

        <Chart
          dataSource={
            analytics.jobsPerDay
          }
        >
          <ArgumentAxis
            argumentType="datetime"
          />

          <ValueAxis />

          <LineSeries
            valueField="count"
            argumentField="date"
            type="line"
          />
        </Chart>

      </Card>
    </>
  );
}