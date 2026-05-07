// import { useEffect, useState } from "react";

// import {
//   getAllReports,
//   reviewReport,
//   rejectReport,
//   resolveReport
// } from "../../api/adminApi";

// import toast from "react-hot-toast";

// /* DEVEXTREME */
// import DataGrid, {
//   Column,
//   SearchPanel,
//   Paging,
//   FilterRow
// } from "devextreme-react/data-grid";

// export default function AdminReports() {

//   const [reports, setReports] = useState([]);

//   // 🔥 ADMIN NOTES
//   const [adminNotes, setAdminNotes] =
//     useState({});

//   // =========================
//   // LOAD REPORTS
//   // =========================
//   const loadReports = async () => {

//     try {

//       const res = await getAllReports();

//       const reportsData =
//         res.data?.data || res.data;

//       setReports(reportsData);

//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load reports");
//     }
//   };

//   // =========================
//   // INIT
//   // =========================
//   useEffect(() => {
//     loadReports();
//   }, []);

//   // =========================
//   // REPORT ACTIONS
//   // =========================
//   const handleReportAction = async (
//     reportId,
//     action
//   ) => {

//     try {

//       const payload = {
//         adminNotes:
//           adminNotes[reportId] || ""
//       };

//       if (action === "review") {
//         await reviewReport(reportId, payload);
//       }

//       if (action === "reject") {
//         await rejectReport(reportId, payload);
//       }

//       if (action === "resolve") {
//         await resolveReport(reportId, payload);
//       }

//       toast.success(
//         `Report ${action}ed successfully`
//       );

//       loadReports();

//     } catch (err) {
//       console.error(err);
//       toast.error("Action failed");
//     }
//   };

//   return (
//     <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow">

//       <h2 className="text-xl font-semibold mb-6 dark:text-white">
//         Reports Moderation
//       </h2>

//       <DataGrid
//         dataSource={reports}
//         showBorders
//         columnAutoWidth
//       >

//         <SearchPanel visible />
//         <FilterRow visible />
//         <Paging defaultPageSize={5} />

//         <Column
//           dataField="reporterName"
//           caption="Reporter"
//         />

//         <Column
//           dataField="reportedUserName"
//           caption="Reported User"
//         />

//         <Column
//           dataField="jobTitle"
//           caption="Job"
//         />

//         <Column
//           dataField="reason"
//           caption="Reason"
//         />

//         {/* STATUS */}
//         <Column
//           dataField="status"
//           caption="Status"
//           cellRender={(data) => {

//             const status = data.value;

//             let color = "bg-yellow-500";

//             if (status === "Rejected")
//               color = "bg-red-500";

//             if (status === "ActionTaken")
//               color = "bg-green-500";

//             if (status === "Reviewed")
//               color = "bg-blue-500";

//             return (
//               <span
//                 className={`text-white px-3 py-1 rounded-full text-xs ${color}`}
//               >
//                 {status}
//               </span>
//             );
//           }}
//         />

//         {/* NOTES */}
//         <Column
//           caption="Admin Notes"
//           cellRender={(data) => (
//             <textarea
//               rows={2}
//               placeholder="Enter notes..."
//               className="border rounded p-2 w-52 dark:bg-slate-800 dark:text-white"
//               value={
//                 adminNotes[data.data.id] || ""
//               }
//               onChange={(e) =>
//                 setAdminNotes((prev) => ({
//                   ...prev,
//                   [data.data.id]:
//                     e.target.value
//                 }))
//               }
//             />
//           )}
//         />

//         {/* ACTIONS */}
//         <Column
//           caption="Actions"
//           cellRender={(data) => {

//             const report = data.data;

//             return (
//               <div className="flex flex-col gap-2">

//                 <button
//                   onClick={() =>
//                     handleReportAction(
//                       report.id,
//                       "review"
//                     )
//                   }
//                   className="bg-blue-500 text-white px-3 py-1 rounded"
//                 >
//                   Review
//                 </button>

//                 <button
//                   onClick={() =>
//                     handleReportAction(
//                       report.id,
//                       "reject"
//                     )
//                   }
//                   className="bg-red-500 text-white px-3 py-1 rounded"
//                 >
//                   Reject
//                 </button>

//                 <button
//                   onClick={() =>
//                     handleReportAction(
//                       report.id,
//                       "resolve"
//                     )
//                   }
//                   className="bg-green-500 text-white px-3 py-1 rounded"
//                 >
//                   Resolve
//                 </button>

//               </div>
//             );
//           }}
//         />

//       </DataGrid>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";

import {
  getAllReports,
  reviewReport,
  rejectReport,
  resolveReport,
  banUser,
} from "../../api/adminApi";

import toast from "react-hot-toast";

import {
  ShieldAlert,
  Search,
  Clock3,
  Eye,
  Gavel,
  XCircle,
} from "lucide-react";

export default function AdminReports() {

  const [reports, setReports] =
    useState([]);

  const [selectedReport, setSelectedReport] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [activeFilter, setActiveFilter] =
    useState("All");

  // 🔥 BAN CONFIRMATION
  const [showBanConfirm, setShowBanConfirm] =
    useState(false);

  const [reportToBan, setReportToBan] =
    useState(null);

  // =========================
  // LOAD REPORTS
  // =========================
  const loadReports = async () => {

    try {

      const res = await getAllReports();

      const reportsData =
        res.data?.data || res.data;

      setReports(reportsData);

    } catch (err) {

      console.error(err);

      toast.error(
        "Failed to load reports"
      );
    }
  };

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    loadReports();
  }, []);

  // =========================
  // FILTER REPORTS
  // =========================
  const filteredReports = useMemo(() => {

    let filtered = reports;

    // STATUS FILTER
    if (activeFilter !== "All") {

      filtered = filtered.filter(
        (r) => r.status === activeFilter
      );
    }

    // SEARCH
    if (search.trim()) {

      filtered = filtered.filter((r) =>
        [
          r.reporterName,
          r.reportedUserName,
          r.reason,
          r.details,
          r.jobTitle,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    return filtered;

  }, [reports, search, activeFilter]);

  // =========================
  // OPEN MODAL
  // =========================
  const openReport = (report) => {
    setSelectedReport(report);
  };

  // =========================
  // HANDLE ACTIONS
  // =========================
  const handleAction = async (
    action
  ) => {

    if (!selectedReport) return;

    try {

      const payload = {};

      if (action === "review") {

        await reviewReport(
          selectedReport.id,
          payload
        );
      }

      if (action === "reject") {

        await rejectReport(
          selectedReport.id,
          payload
        );
      }

      toast.success(
        `Report ${action}ed successfully`
      );

      setSelectedReport(null);

      loadReports();

    } catch (err) {

      console.error(err);

      toast.error(
        "Action failed"
      );
    }
  };

  // =========================
  // STATUS COLORS
  // =========================
  const getStatusStyles = (status) => {

    switch (status) {

      case "Reviewed":
        return "bg-blue-100 text-blue-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "ActionTaken":
        return "bg-green-100 text-green-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="space-y-6">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Reports Moderation
          </h1>

          <p className="text-slate-500 mt-1">
            Manage user misconduct reports
          </p>

        </div>

        {/* SEARCH */}
        <div className="relative">

          <Search
            className="absolute left-3 top-3 text-slate-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-white w-72"
          />

        </div>
      </div>

      {/* ========================= */}
      {/* FILTERS */}
      {/* ========================= */}
      <div className="flex flex-wrap gap-3">

        {[
          "All",
          "Pending",
          "Reviewed",
          "Rejected",
          "ActionTaken",
        ].map((status) => (

          <button
            key={status}
            onClick={() =>
              setActiveFilter(status)
            }
            className={`px-4 py-2 rounded-full text-sm transition ${
              activeFilter === status
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-slate-900 border dark:border-slate-700 text-slate-700 dark:text-slate-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* ========================= */}
      {/* REPORT CARDS */}
      {/* ========================= */}
      <div className="grid gap-5">

        {filteredReports.length === 0 ? (

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center shadow">

            <ShieldAlert
              className="mx-auto text-slate-400 mb-4"
              size={40}
            />

            <p className="text-slate-500">
              No reports found
            </p>

          </div>

        ) : (

          filteredReports.map((report) => (

            <div
              key={report.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition"
            >

              {/* TOP */}
              <div className="flex justify-between items-start gap-4">

                <div className="flex-1 space-y-4">

                  {/* REASON */}
                  <div>

                    <div className="flex items-center gap-3 mb-2">

                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        Report Reason
                      </p>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(report.status)}`}
                      >
                        {report.status}
                      </span>

                    </div>

                    <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                      {report.reason}
                    </h3>

                  </div>

                  {/* DETAILS */}
                  <div>

                    <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
                      Incident Details
                    </p>

                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {report.details || "No details provided"}
                    </p>

                  </div>

                </div>

                {/* OPEN BUTTON */}
                <button
                  onClick={() =>
                    openReport(report)
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  <Eye size={18} />
                  Open
                </button>

              </div>

              {/* META */}
              <div className="grid md:grid-cols-3 gap-4 mt-8">

                <InfoCard
                  label="Reporter"
                  value={report.reporterName}
                />

                <InfoCard
                  label="Reported User"
                  value={report.reportedUserName}
                />

                <InfoCard
                  label="Job"
                  value={report.jobTitle}
                />

              </div>

            </div>
          ))
        )}
      </div>

      {/* ========================= */}
      {/* MODERATION MODAL */}
      {/* ========================= */}
      {selectedReport && (

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl p-8 shadow-2xl">

            {/* HEADER */}
            <div className="flex justify-between items-start">

              <div>

                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                  Moderation Review
                </h2>

                <p className="text-slate-500 mt-2">
                  Review and take moderation action
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedReport(null)
                }
                className="text-slate-400 hover:text-slate-600 text-3xl"
              >
                ×
              </button>

            </div>

            {/* BODY */}
            <div className="mt-8 space-y-8">

              {/* INFO GRID */}
              <div className="grid md:grid-cols-2 gap-5">

                <InfoCard
                  label="Reporter"
                  value={selectedReport.reporterName}
                />

                <InfoCard
                  label="Reported User"
                  value={selectedReport.reportedUserName}
                />

                <InfoCard
                  label="Job"
                  value={selectedReport.jobTitle}
                />

                <InfoCard
                  label="Status"
                  value={selectedReport.status}
                />

              </div>

              {/* REPORT REASON */}
              <div>

                <p className="text-sm text-slate-400 mb-2 uppercase tracking-wide">
                  Report Reason
                </p>

                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-5">

                  <p className="text-lg font-semibold text-slate-800 dark:text-white">
                    {selectedReport.reason}
                  </p>

                </div>

              </div>

              {/* INCIDENT DETAILS */}
              <div>

                <p className="text-sm text-slate-400 mb-2 uppercase tracking-wide">
                  Incident Details
                </p>

                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-5">

                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedReport.details ||
                      "No details provided"}
                  </p>

                </div>

              </div>

            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap justify-end gap-3 mt-10">

              {/* REVIEW */}
              {selectedReport.status === "Pending" && (

                <button
                  onClick={() =>
                    handleAction("review")
                  }
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  <Clock3 size={18} />
                  Review
                </button>
              )}

              {/* REJECT + BAN */}
              {selectedReport.status !== "Rejected" &&
               selectedReport.status !== "ActionTaken" && (

                <>
                  <button
                    onClick={() =>
                      handleAction("reject")
                    }
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>

                  <button
                    onClick={() => {

                      setReportToBan(
                        selectedReport
                      );

                      setShowBanConfirm(true);
                    }}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    <Gavel size={18} />
                    Ban User
                  </button>
                </>
              )}

              {/* CLOSED */}
              {(selectedReport.status === "Rejected" ||
                selectedReport.status === "ActionTaken") && (

                <div className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500">
                  Case Closed
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* ========================= */}
      {/* BAN CONFIRMATION MODAL */}
      {/* ========================= */}
      {showBanConfirm && reportToBan && (

        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm">

          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md p-8 shadow-2xl">

            {/* TITLE */}
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
              Ban User
            </h2>

            {/* MESSAGE */}
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">

              Are you sure you want to ban this user?

              <br /><br />

              This action will immediately block the user
              from accessing the platform.

            </p>

            {/* ACTIONS */}
            <div className="flex justify-end gap-4">

              {/* CANCEL */}
              <button
                onClick={() => {

                  setShowBanConfirm(false);

                  setReportToBan(null);
                }}
                className="px-5 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 transition"
              >
                Cancel
              </button>

              {/* CONFIRM */}
              <button
                onClick={async () => {

                  try {

                    // 🔥 BAN USER
                    await banUser(
                      reportToBan.reportedUserId
                    );

                    // 🔥 UPDATE REPORT STATUS
                    await resolveReport(
                      reportToBan.id,
                      {}
                    );

                    toast.success(
                      "User banned successfully"
                    );

                    setShowBanConfirm(false);

                    setReportToBan(null);

                    setSelectedReport(null);

                    loadReports();

                  } catch (err) {

                    console.error(err);

                    toast.error(
                      "Failed to ban user"
                    );
                  }
                }}
                className="px-5 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition"
              >
                Yes, Ban User
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* ========================= */
/* INFO CARD */
/* ========================= */

function InfoCard({
  label,
  value
}) {

  return (
    <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-5">

      <p className="text-sm text-slate-400 mb-2">
        {label}
      </p>

      <p className="font-semibold text-slate-800 dark:text-white">
        {value || "N/A"}
      </p>

    </div>
  );
}