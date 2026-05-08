// import { useEffect, useState } from "react";
// import {
//   getApplicationsForProvider,
//   updateApplicationStatus,
// } from "../../api/jobApi";

// export default function ApplicationsPage() {
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 🔥 PAGINATION STATE
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(5);
//   const [total, setTotal] = useState(0);

//   useEffect(() => {
//     fetchApplications();
//   }, [page, pageSize]);

//   const fetchApplications = async () => {
//     try {
//       const res = await getApplicationsForProvider(page, pageSize);

//       console.log("APPLICATION RESPONSE:", res.data);

//       // ✅ IMPORTANT FIX
//       setApplications(res.data.data || []);
//       setTotal(res.data.total || 0);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = async (id, status) => {
//     try {
//       await updateApplicationStatus(id, status);

//       // ✅ instant UI update
//       setApplications((prev) =>
//         prev.map((app) =>
//           app.id === id ? { ...app, status } : app
//         )
//       );
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data || "Invalid action");
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Approved":
//         return "green";
//       case "Rejected":
//         return "red";
//       default:
//         return "orange";
//     }
//   };

//   const totalPages = Math.ceil(total / pageSize);

//   if (loading) {
//     return <p>Loading applications...</p>;
//   }

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Applications</h2>

//       {applications.length === 0 ? (
//         <p>No applications found</p>
//       ) : (
//         applications.map((app) => (
//           <div
//             key={app.id}
//             style={{
//               border: "1px solid #ccc",
//               padding: "15px",
//               marginBottom: "15px",
//               borderRadius: "8px",
//             }}
//           >
//             <p>
//               <strong>Job:</strong> {app.jobTitle}
//             </p>

//             <p>
//               <strong>Email:</strong> {app.seekerEmail}
//             </p>

//             <p>
//               <strong>Status:</strong>{" "}
//               <span
//                 style={{
//                   color: getStatusColor(app.status),
//                   fontWeight: "bold",
//                 }}
//               >
//                 {app.status}
//               </span>
//             </p>

//             {app.resumeUrl && (
//               <a
//                 href={`https://localhost:7240${app.resumeUrl}`}
//                 target="_blank"
//                 rel="noreferrer"
//               >
//                 View Resume
//               </a>
//             )}

//             <br />
//             <br />

//             {/* 🔥 BUTTON LOGIC */}
//             {app.status === "Applied" ? (
//               <>
//                 <button
//                   onClick={() =>
//                     handleStatusChange(app.id, "Approved")
//                   }
//                   style={{
//                     marginRight: "10px",
//                     background: "green",
//                     color: "white",
//                     padding: "6px 12px",
//                     border: "none",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Accept
//                 </button>

//                 <button
//                   onClick={() =>
//                     handleStatusChange(app.id, "Rejected")
//                   }
//                   style={{
//                     background: "red",
//                     color: "white",
//                     padding: "6px 12px",
//                     border: "none",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Reject
//                 </button>
//               </>
//             ) : (
//               <button
//                 disabled
//                 style={{
//                   background: "gray",
//                   color: "white",
//                   padding: "6px 12px",
//                   border: "none",
//                 }}
//               >
//                 {app.status}
//               </button>
//             )}
//           </div>
//         ))
//       )}

//       {/* 🔥 PAGINATION CONTROLS */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           marginTop: "20px",
//           alignItems: "center",
//         }}
//       >
//         {/* PREV */}
//         <button
//           onClick={() => setPage((p) => Math.max(p - 1, 1))}
//           disabled={page === 1}
//         >
//           Prev
//         </button>

//         {/* PAGE INFO */}
//         <span>
//           Page {page} / {totalPages || 1}
//         </span>

//         {/* NEXT */}
//         <button
//           onClick={() =>
//             setPage((p) => Math.min(p + 1, totalPages))
//           }
//           disabled={page === totalPages || totalPages === 0}
//         >
//           Next
//         </button>

//         {/* PAGE SIZE */}
//         <select
//           value={pageSize}
//           onChange={(e) => {
//             setPage(1);
//             setPageSize(Number(e.target.value));
//           }}
//         >
//           <option value={5}>5</option>
//           <option value={10}>10</option>
//           <option value={20}>20</option>
//         </select>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import ApplicationCard from "../../components/applications/ApplicationCard";
// import ApplicationFilter from "../../components/applications/ApplicationFilter";
// import ApplicationPagination from "../../components/applications/ApplicationPagination";
// import ApplicationModal from "../../components/applications/ApplicationModal";

// import {
//   getApplicationsForProvider,
//   updateApplicationStatus,
// } from "../../api/jobApi";

// import toast from "react-hot-toast";

// import ReportUserModal from "../../components/ReportUserModal";

// export default function ApplicationsPage() {

//   const [applications, setApplications] =
//     useState([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [jobFilter, setJobFilter] = useState("");


//   // PAGINATION
//   const [page, setPage] =
//     useState(1);

//   const [pageSize, setPageSize] =
//     useState(5);

//   const [total, setTotal] =
//     useState(0);

//   // REPORT MODAL
//   const [showReportModal, setShowReportModal] =
//     useState(false);

//   const [selectedApplication, setSelectedApplication] =
//     useState(null);

//   // =========================
//   // FETCH APPLICATIONS
//   // =========================
//   useEffect(() => {
//     fetchApplications();
//   }, [page, pageSize]);

//   const fetchApplications = async () => {

//     try {

//       const res =
//         await getApplicationsForProvider(
//           page,
//           pageSize
//         );

//       setApplications(
//         res.data.data || []
//       );

//       setTotal(
//         res.data.total || 0
//       );

//     } catch (err) {

//       console.error(err);

//     } finally {

//       setLoading(false);
//     }
//   };

//   // =========================
//   // STATUS UPDATE
//   // =========================
//   const handleStatusChange = async (
//     id,
//     status
//   ) => {

//     try {

//       await updateApplicationStatus(
//         id,
//         status
//       );

//       setApplications((prev) =>
//         prev.map((app) =>
//           app.id === id
//             ? { ...app, status }
//             : app
//         )
//       );

//       toast.success(
//         `Application ${status}`
//       );

//     } catch (err) {

//       console.error(err);

//       toast.error(
//         err.response?.data ||
//         "Invalid action"
//       );
//     }
//   };

//   // =========================
//   // STATUS COLORS
//   // =========================
//   const getStatusColor = (status) => {

//     switch (status) {

//       case "Approved":
//         return "green";

//       case "Rejected":
//         return "red";

//       default:
//         return "orange";
//     }
//   };

//   // =========================
//   // OPEN REPORT MODAL
//   // =========================
//   const openReportModal = (app) => {

//     setSelectedApplication(app);

//     setShowReportModal(true);
//   };

//   const totalPages =
//     Math.ceil(total / pageSize);

//   const filteredApplications = applications.filter((app) =>
//     app.jobTitle
//     ?.toLowerCase()
//     .includes(jobFilter.toLowerCase())
//     );


//   // =========================
//   // LOADING
//   // =========================
//   if (loading) {

//     return (
//       <p className="p-6">
//         Loading applications...
//       </p>
//     );
//   }

//   return (
//     <div className="p-6">

//       <h2 className="text-3xl font-bold mb-8 text-slate-800 dark:text-white">
//         Applications
//       </h2>

//       <input
// type="text"
// placeholder="Filter by job title..."
// value={jobFilter}
// onChange={(e) => setJobFilter(e.target.value)}
// className="w-full md:w-80 px-4 py-3 mb-6 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
// />


//       {filteredApplications.length === 0 ? (

//         <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 shadow text-center">

//           <p className="text-slate-500">
//             {jobFilter
// ? "No applications match this job title"
// : "No applications found"}
//           </p>

//         </div>

//       ) : (

//         filteredApplications.map((app) => (

//           <div
//             key={app.id}
//             className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-5 shadow-sm hover:shadow-md transition"
//           >

//             {/* JOB */}
//             <p className="mb-2">

//               <strong>Job:</strong>{" "}

//               {app.jobTitle}
//             </p>

//             {/* EMAIL */}
//             <p className="mb-2">

//               <strong>Email:</strong>{" "}

//               {app.seekerEmail}
//             </p>

//             {/* STATUS */}
//             <p className="mb-3">

//               <strong>Status:</strong>{" "}

//               <span
//                 style={{
//                   color:
//                     getStatusColor(app.status),

//                   fontWeight: "bold",
//                 }}
//               >
//                 {app.status}
//               </span>
//             </p>

//             {/* RESUME */}
//             {app.resumeUrl && (

//               <a
//                 href={`https://localhost:7240${app.resumeUrl}`}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="text-blue-500 underline"
//               >
//                 View Resume
//               </a>
//             )}

//             <br />
//             <br />

//             {/* ACTIONS */}
//             {app.status === "Applied" ? (

//               <div className="flex gap-3">

//                 <button
//                   onClick={() =>
//                     handleStatusChange(
//                       app.id,
//                       "Approved"
//                     )
//                   }
//                   className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl transition"
//                 >
//                   Accept
//                 </button>

//                 <button
//                   onClick={() =>
//                     handleStatusChange(
//                       app.id,
//                       "Rejected"
//                     )
//                   }
//                   className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl transition"
//                 >
//                   Reject
//                 </button>

//               </div>

//             ) : app.status === "Approved" ? (

//               <div className="flex gap-3">

//                 <button
//                   disabled
//                   className="bg-slate-500 text-white px-5 py-2 rounded-xl"
//                 >
//                   Approved
//                 </button>

//                 <button
//                   onClick={() =>
//                     openReportModal(app)
//                   }
//                   className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl transition"
//                 >
//                   Report User
//                 </button>

//               </div>

//             ) : (

//               <button
//                 disabled
//                 className="bg-slate-500 text-white px-5 py-2 rounded-xl"
//               >
//                 {app.status}
//               </button>
//             )}

//           </div>
//         ))
//       )}

//       {/* PAGINATION */}
//       <div className="flex justify-between items-center mt-8">

//         <button
//           onClick={() =>
//             setPage((p) =>
//               Math.max(p - 1, 1)
//             )
//           }
//           disabled={page === 1}
//           className="px-4 py-2 bg-slate-200 rounded-xl"
//         >
//           Prev
//         </button>

//         <span className="font-medium">
//           Page {page} / {totalPages || 1}
//         </span>

//         <button
//           onClick={() =>
//             setPage((p) =>
//               Math.min(
//                 p + 1,
//                 totalPages
//               )
//             )
//           }
//           disabled={
//             page === totalPages ||
//             totalPages === 0
//           }
//           className="px-4 py-2 bg-slate-200 rounded-xl"
//         >
//           Next
//         </button>

//       </div>

//       {/* REPORT MODAL */}
//       <ReportUserModal
//         open={showReportModal}
//         onClose={() =>
//           setShowReportModal(false)
//         }
//         application={selectedApplication}
//       />

//     </div>
//   );
// }

import { useEffect, useState } from "react";

import {
  getApplicationsForProvider,
  updateApplicationStatus,
} from "../../api/jobApi";

import toast from "react-hot-toast";

import ReportUserModal from "../../components/ReportUserModal";

import ApplicationCard from "../../components/applications/ApplicationCard";
import ApplicationFilter from "../../components/applications/ApplicationFilter";
import ApplicationPagination from "../../components/applications/ApplicationPagination";
import ApplicationModal from "../../components/applications/ApplicationModal";

export default function ApplicationsPage() {

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [jobFilter, setJobFilter] =
    useState("");

  // PAGINATION
  const [page, setPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(5);

  const [total, setTotal] =
    useState(0);

  // MODALS
  const [showReportModal, setShowReportModal] =
    useState(false);

  const [showApplicationModal, setShowApplicationModal] =
    useState(false);

  const [selectedApplication, setSelectedApplication] =
    useState(null);

  // =========================
  // FETCH APPLICATIONS
  // =========================
  useEffect(() => {
    fetchApplications();
  }, [page, pageSize]);

  const fetchApplications = async () => {

    try {

      const res =
        await getApplicationsForProvider(
          page,
          pageSize
        );

      setApplications(
        res.data.data || []
      );

      setTotal(
        res.data.total || 0
      );

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // FILTERING
  // =========================
  const filteredApplications =
    applications.filter((app) =>
      app.jobTitle
        ?.toLowerCase()
        .includes(
          jobFilter.toLowerCase()
        )
    );

  // =========================
  // OPEN APPLICATION MODAL
  // =========================
  const openApplication = (
    application
  ) => {

    setSelectedApplication(application);

    setShowApplicationModal(true);
  };

  // =========================
  // STATUS UPDATE
  // =========================
  const handleStatusChange = async (
    id,
    status
  ) => {

    try {

      await updateApplicationStatus(
        id,
        status
      );

      setApplications((prev) =>
        prev.map((app) =>
          app.id === id
            ? { ...app, status }
            : app
        )
      );

      setSelectedApplication((prev) =>
        prev
          ? { ...prev, status }
          : prev
      );

      toast.success(
        `Application ${status}`
      );

    } catch (err) {

      console.error(err);

      toast.error(
        err.response?.data ||
        "Invalid action"
      );
    }
  };

  // =========================
  // REPORT MODAL
  // =========================
  const openReportModal = (
    app
  ) => {

    setSelectedApplication(app);

    setShowReportModal(true);
  };

  const totalPages =
    Math.ceil(total / pageSize);

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (
      <p className="p-6">
        Loading applications...
      </p>
    );
  }

  return (
    <div className="p-6">

      {/* HEADER */}
      {/* <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white">
        Applications
      </h2> */}

      {/* FILTER */}
      <ApplicationFilter
        value={jobFilter}
        onChange={setJobFilter}
      />

      {/* EMPTY STATE */}
      {filteredApplications.length === 0 ? (

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 shadow text-center">

          <p className="text-slate-500">

            {jobFilter
              ? "No applications match this job title"
              : "No applications found"}

          </p>

        </div>

      ) : (

        filteredApplications.map((app) => (

          <ApplicationCard
            key={app.id}
            app={app}
            onClick={() =>
              openApplication(app)
            }
          >

            <button
              className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition"
            >
              View Details
            </button>

          </ApplicationCard>
        ))
      )}

      {/* PAGINATION */}
      <ApplicationPagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
      />

      {/* PAGE SIZE */}
      <div className="mt-4">

        <select
          value={pageSize}
          onChange={(e) => {

            setPage(1);

            setPageSize(
              Number(e.target.value)
            );
          }}
          className="px-4 py-2 border rounded-xl"
        >

          <option value={5}>
            5
          </option>

          <option value={10}>
            10
          </option>

          <option value={20}>
            20
          </option>

        </select>

      </div>

      {/* APPLICATION MODAL */}
      <ApplicationModal
        open={showApplicationModal}
        onClose={() =>
          setShowApplicationModal(false)
        }
        application={selectedApplication}
      >

        {selectedApplication?.status === "Applied" && (

          <div className="flex gap-3 mt-6">

            <button
              onClick={() =>
                handleStatusChange(
                  selectedApplication.id,
                  "Approved"
                )
              }
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl transition"
            >
              Accept
            </button>

            <button
              onClick={() =>
                handleStatusChange(
                  selectedApplication.id,
                  "Rejected"
                )
              }
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl transition"
            >
              Reject
            </button>

          </div>
        )}

        {selectedApplication?.status === "Approved" && (

          <div className="flex gap-3 mt-6">

            <button
              disabled
              className="bg-slate-500 text-white px-5 py-2 rounded-xl"
            >
              Approved
            </button>

            <button
              onClick={() =>
                openReportModal(
                  selectedApplication
                )
              }
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl transition"
            >
              Report User
            </button>

          </div>
        )}

      </ApplicationModal>

      {/* REPORT MODAL */}
      <ReportUserModal
        open={showReportModal}
        onClose={() =>
          setShowReportModal(false)
        }
        application={selectedApplication}
      />

    </div>
  );
}