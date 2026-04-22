// import { useEffect, useState } from "react";
// import { getAllJobs} from "../../api/adminApi";
// import JobCard from "../../components/JobCard";
// import JobDetailsModal from "../../components/JobDetailsModal";
// import toast from "react-hot-toast";

// export default function AdminJobs() {
//   const [jobs, setJobs] = useState([]);
//   const [selectedJob, setSelectedJob] = useState(null);

//   const fetchJobs = async () => {
//     try {
//       const res = await getAllJobs();
//       setJobs(res.data);
//     } catch {
//       toast.error("Failed to load jobs");
//     }
//   };

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   // 🔥 DELETE JOB
//   const handleDeleteJob = async (id) => {
//     if (!confirm("Delete this job?")) return;

//     try {
//       await deleteJob(id);
//       setJobs(jobs.filter((j) => j.id !== id));
//       setSelectedJob(null);
//       toast.success("Job deleted");
//     } catch {
//       toast.error("Delete failed");
//     }
//   };

//   return (
//     <div className="space-y-4">

//       {jobs.map((job) => (
//         <JobCard
//           key={job.id}
//           job={job}
//           onClick={() => setSelectedJob(job)}
//         />
//       ))}

//       {/* 🔥 MODAL */}
//       {selectedJob && (
//         <JobDetailsModal
//           job={selectedJob}
//           onClose={() => setSelectedJob(null)}
//           onDelete={handleDeleteJob}   // ✅ IMPORTANT
//         />
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { getAllJobs } from "../../api/adminApi";
import JobCard from "../../components/JobCard";
import JobDetailsModal from "../../components/JobDetailsModal";
import toast from "react-hot-toast";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    try {
      const res = await getAllJobs();
      setJobs(res.data);
    } catch {
      toast.error("Failed to load jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="space-y-4">

      {/* JOB LIST */}
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onClick={() => setSelectedJob(job)} // ✅ Admin can VIEW details
          clickable={true}
        />
      ))}

      {/* 🔥 VIEW ONLY MODAL */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          isAdmin={true} // ✅ important
        />
      )}

    </div>
  );
}