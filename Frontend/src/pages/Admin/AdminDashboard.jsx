// import { useEffect, useState } from "react";
// import {
//   getAllUsers,
//   banUser,
//   unbanUser,
//   getAnalytics
// } from "../../api/adminApi";

// import { Users, Briefcase, UserX } from "lucide-react";
// import toast from "react-hot-toast";
// import connection from "../../services/signalr";

// /* DevExtreme */
// import PieChart, {
//   Series,
//   Tooltip as PieTooltip,
//   Legend,
//   Label
// } from "devextreme-react/pie-chart";

// import Chart, {
//   ArgumentAxis,
//   ValueAxis,
//   Series as LineSeries
// } from "devextreme-react/chart";

// import DataGrid, {
//   Column,
//   SearchPanel,
//   Paging,
//   FilterRow
// } from "devextreme-react/data-grid";

// export default function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [analytics, setAnalytics] = useState(null);

//   // 🔥 loading guards (prevents duplicate calls)
//   let isLoadingUsers = false;
//   let isLoadingAnalytics = false;

//   const loadUsers = async () => {
//   try {
//     const res = await getAllUsers(1, 5);

//     const usersArray = res.data?.data;

//     const filtered = usersArray.filter(
//       (u) => u.role !== "Admin"
//     );

//     setUsers(filtered);

//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to load users");
//   }
// };

//   // 🔹 LOAD ANALYTICS
//   const loadAnalytics = async () => {
//     if (isLoadingAnalytics) return;
//     isLoadingAnalytics = true;

//     try {
//       const res = await getAnalytics();

//       console.log("ANALYTICS RESPONSE:", res.data);

//       const analyticsData =
//         res.data?.data || res.data;

//       if (!analyticsData)
//         throw new Error("Invalid analytics response");

//       setAnalytics(analyticsData);

//     } catch (err) {
//       console.error("ANALYTICS ERROR:", err);
//       toast.error("Failed to load analytics");
//     } finally {
//       isLoadingAnalytics = false;
//     }
//   };

//   // 🔹 INIT + SIGNALR
//   useEffect(() => {
//     loadUsers();
//     loadAnalytics();

//     connection.off("ReceiveAdminUpdate");

//     connection.on("ReceiveAdminUpdate", () => {
//       console.log("🔄 Admin update received");
//       loadUsers();
//       loadAnalytics();
//     });

//     return () => {
//       connection.off("ReceiveAdminUpdate");
//     };
//   }, []);

//   // 🔥 BAN / UNBAN
//   const handleToggleBan = async (userId, isBanned) => {
//     try {
//       if (isBanned) {
//         await unbanUser(userId);
//         toast.success("User unbanned");
//       } else {
//         await banUser(userId);
//         toast.success("User banned");
//       }

//       loadUsers();
//       loadAnalytics();

//     } catch (err) {
//       console.error(err);
//       toast.error("Action failed");
//     }
//   };

//   return (
//     <div className="space-y-6 p-4">

//       {/* 🔹 STATS */}
//       {analytics && (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

//           <StatCard title="Total Users" value={analytics.totalUsers} icon={<Users />} />
//           <StatCard title="Active Users" value={analytics.activeUsers} icon={<Users />} />
//           <StatCard title="Banned Users" value={analytics.bannedUsers} icon={<UserX />} />
//           <StatCard title="Total Jobs" value={analytics.totalJobs} icon={<Briefcase />} />

//         </div>
//       )}

//       {/* 🔹 PIE */}
//       {analytics && (
//         <div className="bg-white p-6 rounded-xl shadow">

//           <h2 className="text-lg font-semibold mb-4">
//             User Distribution
//           </h2>

//           <PieChart
//             dataSource={[
//               {
//                 name: "Seekers",
//                 value: analytics.seekers
//               },
//               {
//                 name: "Providers",
//                 value: analytics.providers
//               }
//             ]}
//           >

//       <Series
//         argumentField="name"
//         valueField="value"
//       >

//         <Label
//       visible
//       customizeText={(point) => {
//         return `${Math.round(
//           point.percent * 100
//         )}%`;
//       }}
//     />

//       </Series>

//       <Legend visible />

//       <PieTooltip
//         enabled
//         customizeTooltip={(arg) => {

//           return {
//             text:
//               `${arg.argumentText}: ${arg.percentText}`
//           };
//         }}
//       />

//     </PieChart>

//   </div>
// )}

//       {/* 🔹 LINE */}
//       {analytics && (
//         <div className="bg-white p-6 rounded-xl shadow">
//           <h2 className="text-lg font-semibold mb-4">Jobs Over Time</h2>

//           <Chart dataSource={analytics.jobsPerDay}>
//             <ArgumentAxis argumentType="datetime" />
//             <ValueAxis />

//             <LineSeries
//               valueField="count"
//               argumentField="date"
//               type="line"
//             />
//           </Chart>
//         </div>
//       )}

//       {/* 🔹 USERS TABLE */}
//       <div className="bg-white p-6 rounded-xl shadow">
//         <h2 className="text-lg font-semibold mb-4">Users List</h2>

//         <DataGrid dataSource={users} showBorders columnAutoWidth>

//           <SearchPanel visible />
//           <FilterRow visible />
//           <Paging defaultPageSize={5} />

//           <Column dataField="name" />
//           <Column dataField="email" />
//           <Column dataField="role" />

//           <Column
//             dataField="isBanned"
//             caption="Status"
//             cellRender={(data) => (
//               <span className={data.value ? "text-red-500" : "text-green-500"}>
//                 {data.value ? "Banned" : "Active"}
//               </span>
//             )}
//           />

//           <Column
//             caption="Action"
//             cellRender={(data) => {
//               const isBanned = data.data.isBanned;

//               return (
//                 <button
//                   onClick={() =>
//                     handleToggleBan(data.data.id, isBanned)
//                   }
//                   className={`px-3 py-1 rounded text-white ${
//                     isBanned ? "bg-green-500" : "bg-red-500"
//                   }`}
//                 >
//                   {isBanned ? "Unban" : "Ban"}
//                 </button>
//               );
//             }}
//           />

//         </DataGrid>
//       </div>
//     </div>
//   );
// }

// function StatCard({ title, value, icon }) {
//   return (
//     <div className="p-5 bg-white rounded-xl shadow flex items-center gap-4">
//       <div className="text-blue-500">{icon}</div>
//       <div>
//         <p className="text-sm text-gray-500">{title}</p>
//         <h3 className="text-xl font-semibold">{value}</h3>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import {
  getAllUsers,
  banUser,
  unbanUser,
  getAnalytics,
  exportJobsReport,
  getJobsReportPreview
} from "../../api/adminApi";


import {
  Users,
  Briefcase,
  UserX
} from "lucide-react";

import toast from "react-hot-toast";
import connection from "../../services/signalr";

/* DevExtreme */
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

import DataGrid, {
  Column,
  SearchPanel,
  Paging,
  FilterRow
} from "devextreme-react/data-grid";

export default function AdminDashboard() {

  const [users, setUsers] = useState([]);

  const [analytics, setAnalytics] =
    useState(null);

  // 🔥 REPORT SELECTOR
  const [selectedReport, setSelectedReport] =
    useState("overview");

  // 🔥 loading guards
  let isLoadingUsers = false;
  let isLoadingAnalytics = false;

  // 🔹 LOAD USERS
  const loadUsers = async () => {

    try {

      const res =
        await getAllUsers(1, 5);

      const usersArray =
        res.data?.data;

      const filtered =
        usersArray.filter(
          (u) => u.role !== "Admin"
        );

      setUsers(filtered);

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to load users"
      );
    }
  };

  // 🔹 LOAD ANALYTICS
  const loadAnalytics = async () => {

    if (isLoadingAnalytics) return;

    isLoadingAnalytics = true;

    try {

      const res =
        await getAnalytics();

      console.log(
        "ANALYTICS RESPONSE:",
        res.data
      );

      const analyticsData =
        res.data?.data || res.data;

      if (!analyticsData)
        throw new Error(
          "Invalid analytics response"
        );

      setAnalytics(analyticsData);

    } catch (err) {

      console.error(
        "ANALYTICS ERROR:",
        err
      );

      toast.error(
        "Failed to load analytics"
      );

    } finally {

      isLoadingAnalytics = false;
    }
  };

  const fetchJobsPreview =
  async () => {

    try {

      const response =
        await getJobsReportPreview();

      setJobsPreview(
        response.data
      );

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to load report preview"
      );
    }
};

  const [jobsPreview, setJobsPreview] =
  useState([]);

  // 🔹 INIT + SIGNALR
  useEffect(() => {

    loadUsers();

    loadAnalytics();

    fetchJobsPreview();

    connection.off(
      "ReceiveAdminUpdate"
    );

    connection.on(
      "ReceiveAdminUpdate",
      () => {

        console.log(
          "🔄 Admin update received"
        );

        loadUsers();

        loadAnalytics();
      }
    );

    return () => {

      connection.off(
        "ReceiveAdminUpdate"
      );
    };

  }, []);

  const downloadJobsReport =
  async () => {

    try {

      const response =
        await exportJobsReport();

      const url =
        window.URL.createObjectURL(
          new Blob([response.data])
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        "jobs-report.xlsx"
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      toast.success(
        "Jobs report downloaded"
      );

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to export jobs report"
      );
    }
};

  // 🔥 BAN / UNBAN
  const handleToggleBan = async (
    userId,
    isBanned
  ) => {

    try {

      if (isBanned) {

        await unbanUser(userId);

        toast.success(
          "User unbanned"
        );

      } else {

        await banUser(userId);

        toast.success(
          "User banned"
        );
      }

      loadUsers();

      loadAnalytics();

    } catch (err) {

      console.error(err);

      toast.error(
        "Action failed"
      );
    }
  };

  return (

    <div className="space-y-6 p-4">

      {/* 🔹 REPORT SELECTOR */}
      <div className="flex justify-end">

        <select
          value={selectedReport}
          onChange={(e) =>
            setSelectedReport(
              e.target.value
            )
          }
          className="border rounded-lg px-4 py-2 bg-white shadow"
        >

          <option value="overview">
            Platform Overview
          </option>

          <option value="moderation">
            Moderation Analytics
          </option>
          
          <option value="jobsReport">
            Jobs Report
          </option>
        </select>

      </div>

      {/* 🔹 OVERVIEW */}
      {selectedReport === "overview" && (
        <>

          {/* 🔹 STATS */}
          {analytics && (
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
          )}

          {/* 🔹 USER DISTRIBUTION */}
          {analytics && (
            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="text-lg font-semibold mb-4">
                User Distribution
              </h2>

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
                    customizeText={(point) => {
                      return `${Math.round(
                        point.percent * 100
                      )}%`;
                    }}
                  />

                </Series>

                <Legend visible />

                <PieTooltip
                  enabled
                  customizeTooltip={(arg) => {

                    return {
                      text:
                        `${arg.argumentText}: ${arg.percentText}`
                    };
                  }}
                />

              </PieChart>

            </div>
          )}

          {/* 🔹 JOBS OVER TIME */}
          {analytics && (
            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="text-lg font-semibold mb-4">
                Jobs Over Time
              </h2>

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

            </div>
          )}

        </>
      )}

      {/* 🔹 MODERATION ANALYTICS */}
      {selectedReport === "moderation" &&
        analytics && (

        <div className="space-y-6">

          {/* KPI CARDS */}
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

          {/* TOP REPORT REASONS */}
          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-lg font-semibold mb-4">
              Top Report Reasons
            </h2>

            <div className="space-y-3">

              {analytics.topReportReasons?.map(
                (r, i) => (

                <div
                  key={i}
                  className="flex justify-between border-b pb-2"
                >

                  <span>{r.reason}</span>

                  <span className="font-semibold">
                    {r.count}
                  </span>

                </div>
              ))}

            </div>

          </div>

          {/* REPORTS OVER TIME */}
          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-lg font-semibold mb-4">
              Reports Over Time
            </h2>

            <div className="space-y-2">

              {analytics.reportsPerDay?.map(
                (r, i) => (

                <div
                  key={i}
                  className="flex justify-between border-b pb-2"
                >

                  <span>
                    {new Date(r.date)
                      .toLocaleDateString()}
                  </span>

                  <span className="font-semibold">
                    {r.count}
                  </span>

                </div>
              ))}

            </div>

          </div>

        </div>
      )}

      {/* 🔹 JOBS REPORT */}
{selectedReport === "jobsReport" && (

  <div className="bg-white p-6 rounded-xl shadow">

    <div className="flex justify-between items-center mb-4">

      <h2 className="text-xl font-semibold">
        Jobs Report Preview
      </h2>

      <button
        onClick={downloadJobsReport}
        className="
          bg-green-600
          hover:bg-green-700
          text-white
          px-4
          py-2
          rounded-lg
        "
      >
        Export Excel
      </button>

    </div>

    <div className="overflow-x-auto">

      <table className="min-w-full border">

        <thead className="bg-gray-100">

          <tr>

            <th className="p-3 border">
              Job
            </th>

            <th className="p-3 border">
              Location
            </th>

            <th className="p-3 border">
              Budget
            </th>

            <th className="p-3 border">
              Total Apps
            </th>

            <th className="p-3 border">
              Approved
            </th>

            <th className="p-3 border">
              Rejected
            </th>

          </tr>

        </thead>

        <tbody>

          {jobsPreview.map((job) => (

            <tr key={job.jobId}>

              <td className="p-3 border">
                {job.jobTitle}
              </td>

              <td className="p-3 border">
                {job.location}
              </td>

              <td className="p-3 border">
                {job.budget}
              </td>

              <td className="p-3 border">
                {job.totalApplications}
              </td>

              <td className="p-3 border">
                {job.approvedApplications}
              </td>

              <td className="p-3 border">
                {job.rejectedApplications}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </div>
)}

      {/* 🔹 USERS TABLE */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-lg font-semibold mb-4">
          Users List
        </h2>

        <DataGrid
          dataSource={users}
          showBorders
          columnAutoWidth
        >

          <SearchPanel visible />

          <FilterRow visible />

          <Paging defaultPageSize={5} />

          <Column dataField="name" />

          <Column dataField="email" />

          <Column dataField="role" />

          <Column
            dataField="isBanned"
            caption="Status"
            cellRender={(data) => (

              <span
                className={
                  data.value
                    ? "text-red-500"
                    : "text-green-500"
                }
              >
                {data.value
                  ? "Banned"
                  : "Active"}
              </span>
            )}
          />

          <Column
            caption="Action"
            cellRender={(data) => {

              const isBanned =
                data.data.isBanned;

              return (

                <button
                  onClick={() =>
                    handleToggleBan(
                      data.data.id,
                      isBanned
                    )
                  }
                  className={`px-3 py-1 rounded text-white ${
                    isBanned
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >

                  {isBanned
                    ? "Unban"
                    : "Ban"}

                </button>
              );
            }}
          />

        </DataGrid>

      </div>

    </div>
  );
}

function StatCard({
  title,
  value,
  icon
}) {

  return (

    <div className="p-5 bg-white rounded-xl shadow flex items-center gap-4">

      <div className="text-blue-500">
        {icon}
      </div>

      <div>

        <p className="text-sm text-gray-500">
          {title}
        </p>

        <h3 className="text-xl font-semibold">
          {value}
        </h3>

      </div>

    </div>
  );
}