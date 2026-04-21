// import { useEffect, useState } from "react";
// import { getMyJobs } from "../../api/jobApi";
// import PostJob from "./PostJob";

// export default function ProviderDashboard() {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   const fetchJobs = async () => {
//     try {
//       const res = await getMyJobs();
//       setJobs(res.data);
//     } catch (err) {
//       console.error("Error fetching jobs", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <p>Loading jobs...</p>;
//   }

//   return (
//     <div>
//       <h2>Dashboard</h2>

//       {/* 🔥 POST JOB */}
//       <PostJob onJobCreated={fetchJobs} />

//       <hr />

//       {/* 🔥 JOB LIST */}
//       <h3>My Jobs</h3>

//       {jobs.length === 0 ? (
//         <p>No jobs posted yet</p>
//       ) : (
//         jobs.map((job) => (
//           <div
//             key={job.id}
//             style={{
//               border: "1px solid #ddd",
//               padding: "15px",
//               marginBottom: "15px",
//               borderRadius: "8px",
//               background: "#f9f9f9"
//             }}
//           >
//             <h3>{job.title}</h3>

//             <p>
//               <strong>Description:</strong> {job.description}
//             </p>

//             <p>
//               <strong>Budget:</strong> ₹{job.budget}
//             </p>

//             <p>
//               <strong>Location:</strong> {job.location}
//             </p>

//             <p style={{ fontSize: "12px", color: "gray" }}>
//               Created: {new Date(job.createdAt).toLocaleString()}
//             </p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { getMyJobs, deleteJob } from "../../api/jobApi";
// import PostJob from "./PostJob";
// import { Trash2 } from "lucide-react";
// import EditJobModal from "./EditJobModal";
// import { Pencil } from "lucide-react";

// export default function ProviderDashboard() {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingJob, setEditingJob] = useState(null);

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   const fetchJobs = async () => {
//     try {
//       const res = await getMyJobs();
//       setJobs(res.data);
//     } catch (err) {
//       console.error("Error fetching jobs", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔥 DELETE HANDLER
//   const handleDelete = async (jobId) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this job?"
//     );

//     if (!confirmDelete) return;

//     try {
//       await deleteJob(jobId);

//       // ✅ instant UI update
//       setJobs((prev) => prev.filter((job) => job.id !== jobId));
//     } catch (err) {
//       console.error("Delete failed", err);
//       alert("Failed to delete job");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6 text-center text-gray-500">
//         Loading jobs...
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
      
//       {/* HEADER */}
//       <h2 className="text-2xl font-bold mb-6">Provider Dashboard</h2>

//       {/* POST JOB */}
//       <PostJob onJobCreated={fetchJobs} />

//       {/* JOB LIST */}
//       <h3 className="text-xl font-semibold mt-8 mb-4">My Jobs</h3>

//       {jobs.length === 0 ? (
//         <p className="text-gray-500">No jobs posted yet</p>
//       ) : (
//         <div className="grid gap-4">
//           {jobs.map((job) => (
//             <div
//               key={job.id}
//               className="bg-white shadow-md rounded-xl p-5 border hover:shadow-lg transition"
//             >
//               {/* TITLE + DELETE */}
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-semibold">{job.title}</h3>

//                 <button
//                   onClick={() => handleDelete(job.id)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <Trash2 size={20} />
//                 </button>
//               </div>

//               {/* DETAILS */}
//               <p className="text-gray-600 mt-2">
//                 <strong>Description:</strong> {job.description}
//               </p>

//               <p className="mt-1">
//                 <strong>Budget:</strong> ₹{job.budget}
//               </p>

//               <p className="mt-1">
//                 <strong>Location:</strong> {job.location}
//               </p>

//               {/* FOOTER */}
//               <p className="text-xs text-gray-400 mt-3">
//                 Created: {new Date(job.createdAt).toLocaleString()}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { getMyJobs, deleteJob } from "../../api/jobApi";
// import PostJob from "./PostJob";
// import EditJobModal from "./EditJobModal";
// import { Trash2, Pencil } from "lucide-react";

// export default function ProviderDashboard() {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingJob, setEditingJob] = useState(null);

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   const fetchJobs = async () => {
//     try {
//       const res = await getMyJobs();
//       setJobs(res.data);
//     } catch (err) {
//       console.error("Error fetching jobs", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔥 DELETE HANDLER
//   const handleDelete = async (jobId) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this job?"
//     );

//     if (!confirmDelete) return;

//     try {
//       await deleteJob(jobId);

//       // ✅ instant UI update
//       setJobs((prev) => prev.filter((job) => job.id !== jobId));
//     } catch (err) {
//       console.error("Delete failed", err);
//       alert("Failed to delete job");
//     }
//   };

//   // 🔥 UPDATE HANDLER (for modal)
//   const handleUpdated = (updatedJob) => {
//     setJobs((prev) =>
//       prev.map((job) =>
//         job.id === updatedJob.id ? updatedJob : job
//       )
//     );
//   };

//   if (loading) {
//     return (
//       <div className="p-6 text-center text-gray-500">
//         Loading jobs...
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
      
//       {/* HEADER */}
//       <h2 className="text-2xl font-bold mb-6">Provider Dashboard</h2>

//       {/* POST JOB */}
//       <PostJob onJobCreated={fetchJobs} />

//       {/* JOB LIST */}
//       <h3 className="text-xl font-semibold mt-8 mb-4">My Jobs</h3>

//       {jobs.length === 0 ? (
//         <p className="text-gray-500">No jobs posted yet</p>
//       ) : (
//         <div className="grid gap-4">
//           {jobs.map((job) => (
//             <div
//               key={job.id}
//               className="bg-white shadow-md rounded-xl p-5 border hover:shadow-lg transition"
//             >
//               {/* TITLE + ACTIONS */}
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-semibold">{job.title}</h3>

//                 <div className="flex gap-3">
                  
//                   {/* ✏️ EDIT BUTTON */}
//                   <button
//                     onClick={() => setEditingJob(job)}
//                     className="text-blue-500 hover:text-blue-700"
//                   >
//                     <Pencil size={20} />
//                   </button>

//                   {/* 🗑 DELETE BUTTON */}
//                   <button
//                     onClick={() => handleDelete(job.id)}
//                     className="text-red-500 hover:text-red-700"
//                   >
//                     <Trash2 size={20} />
//                   </button>

//                 </div>
//               </div>

//               {/* DETAILS */}
//               <p className="text-gray-600 mt-2">
//                 <strong>Description:</strong> {job.description}
//               </p>

//               <p className="mt-1">
//                 <strong>Budget:</strong> ₹{job.budget}
//               </p>

//               <p className="mt-1">
//                 <strong>Location:</strong> {job.location}
//               </p>

//               {/* FOOTER */}
//               <p className="text-xs text-gray-400 mt-3">
//                 Created: {new Date(job.createdAt).toLocaleString()}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* 🔥 EDIT MODAL */}
//       {editingJob && (
//         <EditJobModal
//           job={editingJob}
//           onClose={() => setEditingJob(null)}
//           onUpdated={handleUpdated}
//         />
//       )}
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { getMyJobs, deleteJob } from "../../api/jobApi";
// import PostJob from "./PostJob";
// import EditJobModal from "./EditJobModal";
// import { Trash2, Pencil } from "lucide-react";

// export default function ProviderDashboard() {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingJob, setEditingJob] = useState(null);

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   const fetchJobs = async () => {
//     try {
//       const res = await getMyJobs();
//       setJobs(res.data);
//     } catch (err) {
//       console.error("Error fetching jobs", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // DELETE
//   const handleDelete = async (jobId) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this job?"
//     );

//     if (!confirmDelete) return;

//     try {
//       await deleteJob(jobId);
//       setJobs((prev) => prev.filter((job) => job.id !== jobId));
//     } catch (err) {
//       console.error("Delete failed", err);
//       alert("Failed to delete job");
//     }
//   };

//   // UPDATE (from modal)
//   const handleUpdated = (updatedJob) => {
//     setJobs((prev) =>
//       prev.map((job) =>
//         job.id === updatedJob.id ? updatedJob : job
//       )
//     );
//   };

//   if (loading) {
//     return (
//       <div className="p-6 text-center text-gray-500">
//         Loading jobs...
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-5xl mx-auto space-y-6">
      
//       {/* HEADER */}
//       <div>
//         <h2 className="text-2xl font-bold">Provider Dashboard</h2>
//         <p className="text-gray-500 text-sm">
//           Manage and update your posted jobs
//         </p>
//       </div>

//       {/* POST JOB */}
//       <PostJob onJobCreated={fetchJobs} />

//       {/* JOB LIST */}
//       <div>
//         <h3 className="text-xl font-semibold mb-4">My Jobs</h3>

//         {jobs.length === 0 ? (
//           <p className="text-gray-500">No jobs posted yet</p>
//         ) : (
//           <div className="grid gap-5">
//             {jobs.map((job) => (
//               <div
//                 key={job.id}
//                 className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition"
//               >
//                 {/* HEADER */}
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-800">
//                       {job.title}
//                     </h3>
//                     <p className="text-sm text-gray-400 mt-1">
//                       Created:{" "}
//                       {new Date(job.createdAt).toLocaleString()}
//                     </p>
//                   </div>

//                   {/* ACTIONS */}
//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => setEditingJob(job)}
//                       className="p-2 rounded-lg hover:bg-blue-50 text-blue-600"
//                     >
//                       <Pencil size={18} />
//                     </button>

//                     <button
//                       onClick={() => handleDelete(job.id)}
//                       className="p-2 rounded-lg hover:bg-red-50 text-red-500"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </div>

//                 {/* DESCRIPTION */}
//                 <p className="text-gray-600 mt-4 leading-relaxed">
//                   {job.description}
//                 </p>

//                 {/* SKILLS (🔥 NEW - UPWORK STYLE) */}
//                 {job.skills && (
//                   <div className="flex flex-wrap gap-2 mt-4">
//                     {job.skills.split(",").map((skill, index) => (
//                       <span
//                         key={index}
//                         className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
//                       >
//                         {skill.trim()}
//                       </span>
//                     ))}
//                   </div>
//                 )}

//                 {/* FOOTER */}
//                 <div className="flex justify-between items-center mt-5 pt-4 border-t">
//                   <div className="text-sm">
//                     <span className="font-semibold text-gray-700">
//                       Budget:
//                     </span>{" "}
//                     ₹{job.budget}
//                   </div>

//                   <div className="text-sm text-gray-500">
//                     📍 {job.location}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* EDIT MODAL */}
//       {editingJob && (
//         <EditJobModal
//           job={editingJob}
//           onClose={() => setEditingJob(null)}
//           onUpdated={handleUpdated}
//         />
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { getMyJobs, deleteJob } from "../../api/jobApi";
import PostJob from "./PostJob";
import EditJobModal from "./EditJobModal";
import { Trash2, Pencil } from "lucide-react";

export default function ProviderDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await getMyJobs();
      setJobs(res.data || []);
    } catch (err) {
      console.error("Error fetching jobs", err);
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      await deleteJob(jobId);
      fetchJobs(); // 🔥 always fresh
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete job");
    }
  };

  // UPDATE → re-fetch instead of patch
  const handleUpdated = (updatedJob) => {
  setJobs((prevJobs) =>
    prevJobs.map((job) =>
      job.id === updatedJob.id ? updatedJob : job
    )
  );
};

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading jobs...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      
      <h2 className="text-2xl font-bold">Provider Dashboard</h2>

      <PostJob onJobCreated={fetchJobs} />

      <h3 className="text-xl font-semibold mt-6">My Jobs</h3>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs posted yet</p>
      ) : (
        <div className="grid gap-5">
          {jobs.filter(Boolean).map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border shadow-sm p-6"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {job.title}
                </h3>

                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingJob(job)}
                    className="text-blue-500"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(job.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* DESCRIPTION */}
              <p className="text-gray-600 mt-3">
                {job.description}
              </p>

              {/* SKILLS */}
              {job.skills && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {job.skills.split(",").map((skill, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-xs px-3 py-1 rounded-full"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* FOOTER */}
              <div className="flex justify-between mt-4 text-sm">
                <span>₹{job.budget}</span>
                <span className="text-gray-500">
                  📍 {job.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}