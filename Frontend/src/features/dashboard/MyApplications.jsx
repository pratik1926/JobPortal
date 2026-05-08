// import { useEffect, useState } from "react";
// import { getMyApplications } from "../../api/jobApi";

// export default function MyApplications() {
//   const [applications, setApplications] = useState([]);
//   const [selectedApp, setSelectedApp] = useState(null);

//   useEffect(() => {
//     fetchMyApplications();
//   }, []);

//   const fetchMyApplications = async () => {
//     try {
//       const res = await getMyApplications();
//       setApplications(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Approved":
//         return "#16a34a"; // green
//       case "Rejected":
//         return "#dc2626"; // red
//       default:
//         return "#f59e0b"; // orange
//     }
//   };

//   return (
//     <div>
//       <h2 style={{ marginBottom: "20px" }}>My Applications</h2>

//       {applications.length === 0 ? (
//         <p>You have not applied to any jobs yet</p>
//       ) : (
//         applications.map((app) => (
//           <div
//             key={app.id}
//             onClick={() => setSelectedApp(app)}
//             style={{
//               border: "1px solid #e5e7eb",
//               padding: "16px",
//               marginBottom: "16px",
//               borderRadius: "12px",
//               cursor: "pointer",
//               transition: "0.2s",
//               background: "#fff"
//             }}
//             onMouseEnter={(e) =>
//               (e.currentTarget.style.transform = "scale(1.01)")
//             }
//             onMouseLeave={(e) =>
//               (e.currentTarget.style.transform = "scale(1)")
//             }
//           >
//             <h3 style={{ marginBottom: "6px" }}>{app.jobTitle}</h3>

//             <p><strong>Location:</strong> {app.location}</p>

//             <p>
//               <strong>Status:</strong>{" "}
//               <span
//                 style={{
//                   color: getStatusColor(app.status),
//                   fontWeight: "600"
//                 }}
//               >
//                 {app.status}
//               </span>
//             </p>

//             <p>
//               <strong>Applied On:</strong>{" "}
//               {new Date(app.appliedAt).toLocaleString()}
//             </p>

//             {app.resumeUrl && (
//               <a
//                 href={`https://localhost:7240${app.resumeUrl}`}
//                 target="_blank"
//                 rel="noreferrer"
//                 onClick={(e) => e.stopPropagation()}
//                 style={{ color: "#4f46e5", fontSize: "14px" }}
//               >
//                 View Resume
//               </a>
//             )}
//           </div>
//         ))
//       )}

//       {/* 🔥 PREMIUM MODAL */}
//       {selectedApp && (
//         <div
//           onClick={() => setSelectedApp(null)}
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.4)",
//             backdropFilter: "blur(4px)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000
//           }}
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               width: "520px",
//               background: "#fff",
//               borderRadius: "16px",
//               padding: "24px",
//               boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
//               position: "relative",
//               animation: "fadeIn 0.2s ease-out"
//             }}
//           >
//             {/* CLOSE */}
//             <button
//               onClick={() => setSelectedApp(null)}
//               style={{
//                 position: "absolute",
//                 top: "12px",
//                 right: "12px",
//                 border: "none",
//                 background: "transparent",
//                 fontSize: "18px",
//                 cursor: "pointer",
//                 color: "#6b7280"
//               }}
//             >
//               ✕
//             </button>

//             {/* HEADER */}
//             <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#111827" }}>
//               {selectedApp.jobTitle}
//             </h2>

//             <div style={{ marginTop: "6px", color: "#6b7280", fontSize: "14px" }}>
//               {selectedApp.location} •{" "}
//               {new Date(selectedApp.appliedAt).toLocaleDateString()}
//             </div>

//             {/* STATUS */}
//             <div style={{ marginTop: "16px" }}>
//               <span
//                 style={{
//                   padding: "6px 12px",
//                   borderRadius: "999px",
//                   fontSize: "13px",
//                   fontWeight: "500",
//                   background:
//                     selectedApp.status === "Approved"
//                       ? "#dcfce7"
//                       : selectedApp.status === "Rejected"
//                       ? "#fee2e2"
//                       : "#fef3c7",
//                   color:
//                     selectedApp.status === "Approved"
//                       ? "#166534"
//                       : selectedApp.status === "Rejected"
//                       ? "#991b1b"
//                       : "#92400e"
//                 }}
//               >
//                 {selectedApp.status}
//               </span>
//             </div>

//             {/* COVER LETTER */}
//             <div style={{ marginTop: "20px" }}>
//               <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "6px" }}>
//                 Cover Letter
//               </h3>

//               <div
//                 style={{
//                   background: "#f9fafb",
//                   border: "1px solid #e5e7eb",
//                   padding: "12px",
//                   borderRadius: "10px",
//                   fontSize: "14px",
//                   lineHeight: "1.5",
//                   color: "#374151"
//                 }}
//               >
//                 {selectedApp.coverLetter || "No cover letter provided"}
//               </div>
//             </div>

//             {/* RESUME */}
//             {selectedApp.resumeUrl && (
//               <div
//                 style={{
//                   marginTop: "20px",
//                   paddingTop: "12px",
//                   borderTop: "1px solid #e5e7eb",
//                   display: "flex",
//                   justifyContent: "space-between"
//                 }}
//               >
//                 <span style={{ fontSize: "14px", color: "#6b7280" }}>
//                   Attached Resume
//                 </span>

//                 <a
//                   href={`https://localhost:7240${selectedApp.resumeUrl}`}
//                   target="_blank"
//                   rel="noreferrer"
//                   style={{
//                     color: "#4f46e5",
//                     fontWeight: "500",
//                     fontSize: "14px"
//                   }}
//                 >
//                   View Resume →
//                 </a>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { getMyApplications } from "../../api/jobApi";

// export default function MyApplications() {
//   const [applications, setApplications] = useState([]);
//   const [selectedApp, setSelectedApp] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [jobFilter, setJobFilter] = useState("");


//   // 🔥 PAGINATION STATE
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(5);
//   const [total, setTotal] = useState(0);

//   useEffect(() => {
//     fetchMyApplications();
//   }, [page, pageSize]);

//   const fetchMyApplications = async () => {
//     try {
//       const res = await getMyApplications(page, pageSize);

//       console.log("SEEKER APPLICATIONS:", res.data);

//       // ✅ FIX
//       setApplications(res.data.data || []);
//       setTotal(res.data.total || 0);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Approved":
//         return "#16a34a";
//       case "Rejected":
//         return "#dc2626";
//       default:
//         return "#f59e0b";
//     }
//   };

//   const totalPages = Math.ceil(total / pageSize);

//   const filteredApplications = applications.filter((app) =>
//     app.jobTitle
//     ?.toLowerCase()
//     .includes(jobFilter.toLowerCase())
//     );


//   if (loading) {
//     return <p>Loading applications...</p>;
//   }

//   return (
//     <div>
//       <h2 style={{ marginBottom: "20px" }}>My Applications</h2>

//       <input
// type="text"
// placeholder="Filter by job title..."
// value={jobFilter}
// onChange={(e) => setJobFilter(e.target.value)}
// style={{
// width: "320px",
// padding: "12px",
// marginBottom: "20px",
// borderRadius: "10px",
// border: "1px solid #d1d5db",
// outline: "none",
// fontSize: "14px",
// }}
// />


//       {filteredApplications.length === 0 ? (
//         <p>You have not applied to any jobs yet</p>
//       ) : (
//         filteredApplications.map((app) => (
//           <div
//             key={app.id}
//             onClick={() => setSelectedApp(app)}
//             style={{
//               border: "1px solid #e5e7eb",
//               padding: "16px",
//               marginBottom: "16px",
//               borderRadius: "12px",
//               cursor: "pointer",
//               background: "#fff",
//               transition: "0.2s",
//             }}
//             onMouseEnter={(e) =>
//               (e.currentTarget.style.transform = "scale(1.01)")
//             }
//             onMouseLeave={(e) =>
//               (e.currentTarget.style.transform = "scale(1)")
//             }
//           >
//             <h3>{app.jobTitle}</h3>

//             <p>
//               <strong>Location:</strong> {app.location}
//             </p>

//             <p>
//               <strong>Status:</strong>{" "}
//               <span
//                 style={{
//                   color: getStatusColor(app.status),
//                   fontWeight: "600",
//                 }}
//               >
//                 {app.status}
//               </span>
//             </p>

//             <p>
//               <strong>Applied On:</strong>{" "}
//               {new Date(app.appliedAt).toLocaleString()}
//             </p>

//             {app.resumeUrl && (
//               <a
//                 href={`https://localhost:7240${app.resumeUrl}`}
//                 target="_blank"
//                 rel="noreferrer"
//                 onClick={(e) => e.stopPropagation()}
//                 style={{ color: "#4f46e5", fontSize: "14px" }}
//               >
//                 View Resume
//               </a>
//             )}
//           </div>
//         ))
//       )}

//       {/* 🔥 PAGINATION UI */}
//       <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//         <button
//           onClick={() => setPage((p) => Math.max(p - 1, 1))}
//           disabled={page === 1}
//         >
//           Prev
//         </button>

//         <span>
//           Page {page} / {totalPages || 1}
//         </span>

//         <button
//           onClick={() =>
//             setPage((p) => Math.min(p + 1, totalPages))
//           }
//           disabled={page === totalPages || totalPages === 0}
//         >
//           Next
//         </button>

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

//       {/* 🔥 MODAL (UNCHANGED) */}
//       {selectedApp && (
//         <div
//           onClick={() => setSelectedApp(null)}
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.4)",
//             backdropFilter: "blur(4px)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               width: "520px",
//               background: "#fff",
//               borderRadius: "16px",
//               padding: "24px",
//               position: "relative",
//             }}
//           >
//             <button
//               onClick={() => setSelectedApp(null)}
//               style={{
//                 position: "absolute",
//                 top: "12px",
//                 right: "12px",
//                 background: "transparent",
//                 border: "none",
//                 cursor: "pointer",
//               }}
//             >
//               ✕
//             </button>

//             <h2>{selectedApp.jobTitle}</h2>

//             <div style={{ marginTop: "6px" }}>
//               {selectedApp.location} •{" "}
//               {new Date(selectedApp.appliedAt).toLocaleDateString()}
//             </div>

//             <div style={{ marginTop: "20px" }}>
//               {selectedApp.coverLetter || "No cover letter"}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";

import { getMyApplications } from "../../api/jobApi";

import ApplicationCard from "../../components/applications/ApplicationCard";
import ApplicationFilter from "../../components/applications/ApplicationFilter";
import ApplicationPagination from "../../components/applications/ApplicationPagination";
import ApplicationModal from "../../components/applications/ApplicationModal";

export default function MyApplications() {

  const [applications, setApplications] =
    useState([]);

  const [selectedApp, setSelectedApp] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

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

  // =========================
  // FETCH APPLICATIONS
  // =========================
  useEffect(() => {
    fetchMyApplications();
  }, [page, pageSize]);

  const fetchMyApplications = async () => {

    try {

      const res =
        await getMyApplications(
          page,
          pageSize
        );

      console.log(
        "SEEKER APPLICATIONS:",
        res.data
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
  // MODAL
  // =========================
  const openApplication = (
    application
  ) => {

    setSelectedApp(application);

    setShowModal(true);
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
        My Applications
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
              : "You have not applied to any jobs yet"}

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

            <div className="flex gap-3 mt-4">

              <button
                className="bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition"
              >
                View Details
              </button>

            </div>

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
        open={showModal}
        onClose={() =>
          setShowModal(false)
        }
        application={selectedApp}
      />

    </div>
  );
}