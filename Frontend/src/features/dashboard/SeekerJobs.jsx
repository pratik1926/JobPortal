// // // import { useEffect, useState } from "react";
// // // import { getAllJobs, applyToJob, getMyApplications } from "../../api/jobApi";

// // // export default function SeekerJobs() {

// // //   const [jobs, setJobs] = useState([]);

// // //   // ✅ store resume per jobId
// // //   const [resumes, setResumes] = useState({});
// // //   const [coverLetters, setCoverLetters] = useState({});
// // //   const [appliedJobs, setAppliedJobs] = useState([]);

// // //   useEffect(() => {
// // //     fetchJobs();
// // //     fetchAppliedJobs();
// // //   }, []);

// // //   useEffect(() => {
// // //   console.log("Applied Jobs:", appliedJobs);
// // // }, [appliedJobs]);

// // //   const fetchJobs = async () => {
// // //     try {
// // //       const res = await getAllJobs();
// // //       setJobs(res.data);
// // //     } catch (err) {
// // //       console.error(err);
// // //     }
// // //   };

// // //   const fetchAppliedJobs = async () => {
// // //   try {
// // //     const res = await getMyApplications();
// // //     setAppliedJobs(res.data);
// // //   } catch (err) {
// // //     console.error(err);
// // //   }
// // // };

// // //   // ✅ handle file per job
// // //   const handleFileChange = (jobId, file) => {
// // //     setResumes((prev) => ({
// // //       ...prev,
// // //       [jobId]: file,
// // //     }));
// // //   };

// // //   // ✅ handle cover letter per job
// // //   const handleCoverLetterChange = (jobId, value) => {
// // //     setCoverLetters((prev) => ({
// // //       ...prev,
// // //       [jobId]: value,
// // //     }));
// // //   };

// // //   // ✅ updated apply function
// // //   const handleApply = async (jobId) => {
// // //   try {
// // //     const resume = resumes[jobId];
// // //     const coverLetter = coverLetters[jobId] || "";

// // //     if (!resume) {
// // //       alert("Please upload resume");
// // //       return;
// // //     }

// // //     const formData = new FormData();
// // //     formData.append("Resume", resume);
// // //     formData.append("CoverLetter", coverLetter);

// // //     await applyToJob(jobId, formData);

// // //     // ✅ mark as applied
// // //     setAppliedJobs((prev) => {
// // //   if (prev.includes(jobId)) return prev; // prevent duplicates
// // //   return [...prev, jobId];
// // // });

// // //     setTimeout(() => {
// // //       alert("Applied successfully");
// // //     }, 100);

// // //     alert("Applied successfully");

// // //   } catch (err) {
// // //     console.error(err.response);
// // //     alert(JSON.stringify(err.response?.data));
// // //   }
// // // };

// // //   return (
// // //     <div>
// // //       <h3>Browse Jobs</h3>

// // //       {jobs.length === 0 ? (
// // //         <p>No jobs available</p>
// // //       ) : (
// // //         jobs.map((job) => (
// // //           <div
// // //             key={job.id}
// // //             style={{
// // //               border: "1px solid #ddd",
// // //               padding: "15px",
// // //               marginBottom: "15px",
// // //               borderRadius: "8px"
// // //             }}
// // //           >
// // //             <h3>{job.title}</h3>

// // //             <p>{job.description}</p>

// // //             <p><strong>Budget:</strong> ₹{job.budget}</p>

// // //             <p><strong>Location:</strong> {job.location}</p>

// // //             {/* ✅ Resume Upload */}
// // //             <input
// // //               type="file"
// // //               onChange={(e) =>
// // //                 handleFileChange(job.id, e.target.files[0])
// // //               }
// // //             />

// // //             <br /><br />

// // //             {/* ✅ Cover Letter */}
// // //             <textarea
// // //               placeholder="Cover Letter"
// // //               value={coverLetters[job.id] || ""}
// // //               onChange={(e) =>
// // //                 handleCoverLetterChange(job.id, e.target.value)
// // //               }
// // //             />

// // //             <br /><br />

// // //              {/* ✅ SMART APPLY BUTTON */}
// // //             {appliedJobs.includes(Number(job.id)) ? (
// // //               <button disabled style={{ background: "gray", color: "white" }}>
// // //                 Applied
// // //               </button>
// // //             ) : (
// // //               <button
// // //                 onClick={() => handleApply(job.id)}
// // //                 disabled={!resumes[job.id]} // 🔥 disabled until resume uploaded
// // //               >
// // //                 Apply
// // //               </button>
// // //             )}
// // //           </div>
// // //         ))
// // //       )}
// // //     </div>
// // //   );
// // // }

// // import { useEffect, useState } from "react";
// // import { getAllJobs, applyToJob, getMyApplications } from "../../api/jobApi";

// // export default function SeekerJobs() {
// //   const [jobs, setJobs] = useState([]);
// //   const [applications, setApplications] = useState([]);

// //   const [resumes, setResumes] = useState({});
// //   const [coverLetters, setCoverLetters] = useState({});

// //   useEffect(() => {
// //     fetchJobs();
// //     fetchApplications();
// //   }, []);

// //   const fetchJobs = async () => {
// //     try {
// //       const res = await getAllJobs();
// //       setJobs(res.data);
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   const fetchApplications = async () => {
// //     try {
// //       const res = await getMyApplications();
// //       console.log("Applications API:", res.data); // 🔥 DEBUG
// //       setApplications(res.data);
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   // 🔥 FIXED: supports both jobId and nested job.id
// //   const getApplication = (jobId) => {
// //     return applications.find(
// //       (app) => app.jobId === jobId || app.job?.id === jobId
// //     );
// //   };

// //   const handleFileChange = (jobId, file) => {
// //     setResumes((prev) => ({
// //       ...prev,
// //       [jobId]: file,
// //     }));
// //   };

// //   const handleCoverLetterChange = (jobId, value) => {
// //     setCoverLetters((prev) => ({
// //       ...prev,
// //       [jobId]: value,
// //     }));
// //   };

// //   const handleApply = async (jobId) => {
// //     try {
// //       const resume = resumes[jobId];
// //       const coverLetter = coverLetters[jobId] || "";

// //       if (!resume) {
// //         alert("Please upload resume");
// //         return;
// //       }

// //       const formData = new FormData();
// //       formData.append("Resume", resume);
// //       formData.append("CoverLetter", coverLetter);

// //       await applyToJob(jobId, formData);

// //       alert("Applied successfully");

// //       fetchApplications(); // refresh

// //     } catch (err) {
// //       console.error(err.response);
// //       alert(err.response?.data || "Failed to apply");
// //     }
// //   };

// //   const getStatusColor = (status) => {
// //     switch (status) {
// //       case "Approved":
// //         return "green";
// //       case "Rejected":
// //         return "red";
// //       default:
// //         return "orange";
// //     }
// //   };

// //   return (
// //     <div>
// //       <h3>Browse Jobs</h3>

// //       {jobs.length === 0 ? (
// //         <p>No jobs available</p>
// //       ) : (
// //         jobs.map((job) => {
// //           const application = getApplication(job.id);

// //           return (
// //             <div
// //               key={job.id}
// //               style={{
// //                 border: "1px solid #ddd",
// //                 padding: "15px",
// //                 marginBottom: "15px",
// //                 borderRadius: "8px",
// //               }}
// //             >
// //               <h3>{job.title}</h3>
// //               <p>{job.description}</p>
// //               <p><strong>Budget:</strong> ₹{job.budget}</p>
// //               <p><strong>Location:</strong> {job.location}</p>

// //               {/* ✅ STATUS DISPLAY */}
// //               {application && (
// //                 <p>
// //                   <strong>Status:</strong>{" "}
// //                   <span style={{ color: getStatusColor(application.status), fontWeight: "bold" }}>
// //                     {application.status}
// //                   </span>
// //                 </p>
// //               )}

// //               {/* ✅ APPLY SECTION */}
// //               {!application && (
// //                 <>
// //                   <input
// //                     type="file"
// //                     onChange={(e) =>
// //                       handleFileChange(job.id, e.target.files[0])
// //                     }
// //                   />

// //                   <br /><br />

// //                   <textarea
// //                     placeholder="Cover Letter"
// //                     value={coverLetters[job.id] || ""}
// //                     onChange={(e) =>
// //                       handleCoverLetterChange(job.id, e.target.value)
// //                     }
// //                   />

// //                   <br /><br />

// //                   <button
// //                     onClick={() => handleApply(job.id)}
// //                     disabled={!resumes[job.id]}
// //                   >
// //                     Apply
// //                   </button>
// //                 </>
// //               )}
// //             </div>
// //           );
// //         })
// //       )}
// //     </div>
// //   );
// // }

// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import {
// //   Search,
// //   MapPin,
// //   Bookmark,
// //   BookmarkCheck
// // } from "lucide-react";

// // export default function SeekerJobs() {
// //   const [jobs, setJobs] = useState([]);
// //   const [search, setSearch] = useState("");
// //   const [locationFilter, setLocationFilter] = useState("");
// //   const [savedJobs, setSavedJobs] = useState([]);

// //   useEffect(() => {
// //     fetchJobs();
// //   }, []);

// //   const fetchJobs = async () => {
// //     const res = await axios.get("https://localhost:7240/api/Job");
// //     setJobs(res.data);
// //   };

// //   const filteredJobs = jobs.filter((job) =>
// //     job.title.toLowerCase().includes(search.toLowerCase()) &&
// //     job.location.toLowerCase().includes(locationFilter.toLowerCase())
// //   );

// //   const toggleSave = (id) => {
// //     if (savedJobs.includes(id)) {
// //       setSavedJobs(savedJobs.filter((j) => j !== id));
// //     } else {
// //       setSavedJobs([...savedJobs, id]);
// //     }
// //   };

// //   return (
// //     <div className="space-y-5">

// //       {/* 🔍 SEARCH + FILTER */}
// //       <div className="flex gap-4">

// //         <div className="flex items-center bg-white border rounded-xl px-3 flex-1">
// //           <Search size={16} className="text-slate-400" />
// //           <input
// //             type="text"
// //             placeholder="Search jobs..."
// //             className="w-full p-2 outline-none"
// //             value={search}
// //             onChange={(e) => setSearch(e.target.value)}
// //           />
// //         </div>

// //         <input
// //           type="text"
// //           placeholder="Location"
// //           className="border rounded-xl px-3 py-2"
// //           value={locationFilter}
// //           onChange={(e) => setLocationFilter(e.target.value)}
// //         />

// //       </div>

// //       {/* 💼 JOB LIST */}
// //       <div className="grid gap-4">

// //         {filteredJobs.length === 0 && (
// //           <div className="text-center py-10 text-slate-500">
// //             No jobs found
// //           </div>
// //         )}

// //         {filteredJobs.map((job) => (
// //           <div
// //             key={job.id}
// //             className="p-5 bg-white rounded-2xl shadow hover:shadow-md transition"
// //           >
// //             <div className="flex justify-between">

// //               <div className="space-y-2">

// //                 <h3 className="text-lg font-semibold">{job.title}</h3>

// //                 <p className="text-sm text-slate-500">
// //                   {job.description}
// //                 </p>

// //                 {/* SKILLS */}
// //                 {job.skills && (
// //                   <div className="flex gap-2 flex-wrap">
// //                     {job.skills.split(",").map((skill, i) => (
// //                       <span
// //                         key={i}
// //                         className="text-xs bg-slate-100 px-2 py-1 rounded-full"
// //                       >
// //                         {skill}
// //                       </span>
// //                     ))}
// //                   </div>
// //                 )}

// //                 <p className="text-xs text-slate-400">
// //                   {job.providerName}
// //                 </p>

// //               </div>

// //               {/* SAVE */}
// //               <button
// //                 onClick={() => toggleSave(job.id)}
// //                 className="text-slate-500"
// //               >
// //                 {savedJobs.includes(job.id)
// //                   ? <BookmarkCheck className="text-purple-600" />
// //                   : <Bookmark />}
// //               </button>

// //             </div>

// //             {/* FOOTER */}
// //             <div className="flex justify-between mt-4 text-sm text-slate-500">

// //               <span>₹ {job.budget}</span>

// //               <span className="flex items-center gap-1">
// //                 <MapPin size={14} />
// //                 {job.location}
// //               </span>

// //             </div>

// //             {/* APPLY */}
// //             <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
// //               Apply Now
// //             </button>

// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }\

// import { useEffect, useState } from "react";
// import { getAllJobs } from "../../api/jobApi";
// import {
//   Search,
//   MapPin,
//   Bookmark,
//   BookmarkCheck
// } from "lucide-react";
// import JobApplyModal from "../../components/JobApplyModal";
// import toast from "react-hot-toast";

// export default function SeekerJobs() {
//   const [jobs, setJobs] = useState([]);
//   const [search, setSearch] = useState("");
//   const [locationFilter, setLocationFilter] = useState("");
//   const [savedJobs, setSavedJobs] = useState([]);
//   const [selectedJob, setSelectedJob] = useState(null);

//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   const fetchJobs = async () => {
//     try {
//       const res = await getAllJobs();
//       setJobs(res.data.data || []);
//     } catch {
//       toast.error("Failed to load jobs");
//     }
//   };

//   const filteredJobs = jobs.filter((job) =>
//     job.title.toLowerCase().includes(search.toLowerCase()) &&
//     job.location.toLowerCase().includes(locationFilter.toLowerCase())
//   );

//   const toggleSave = (id) => {
//     if (savedJobs.includes(id)) {
//       setSavedJobs(savedJobs.filter((j) => j !== id));
//     } else {
//       setSavedJobs([...savedJobs, id]);
//     }
//   };

//   return (
//     <div className="space-y-5">

//       {/* 🔍 SEARCH + FILTER */}
//       <div className="flex gap-4">

//         <div className="flex items-center bg-white border rounded-xl px-3 flex-1">
//           <Search size={16} className="text-slate-400" />
//           <input
//             type="text"
//             placeholder="Search jobs..."
//             className="w-full p-2 outline-none"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         <input
//           type="text"
//           placeholder="Location"
//           className="border rounded-xl px-3 py-2"
//           value={locationFilter}
//           onChange={(e) => setLocationFilter(e.target.value)}
//         />

//       </div>

//       {/* 💼 JOB LIST */}
//       <div className="grid gap-4">

//         {filteredJobs.length === 0 && (
//           <div className="text-center py-10 text-slate-500">
//             No jobs found
//           </div>
//         )}

//         {filteredJobs.map((job) => (
//           <div
//             key={job.id}
//             onClick={() => setSelectedJob(job)} // 🔥 CLICK OPENS MODAL
//             className="p-5 bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
//           >
//             <div className="flex justify-between">

//               <div className="space-y-2">

//                 <h3 className="text-lg font-semibold">{job.title}</h3>

//                 <p className="text-sm text-slate-500 line-clamp-2">
//                   {job.description}
//                 </p>

//                 {/* SKILLS */}
//                 {job.skills && (
//                   <div className="flex gap-2 flex-wrap">
//                     {job.skills.split(",").map((skill, i) => (
//                       <span
//                         key={i}
//                         className="text-xs bg-slate-100 px-2 py-1 rounded-full"
//                       >
//                         {skill.trim()}
//                       </span>
//                     ))}
//                   </div>
//                 )}

//                 <p className="text-xs text-slate-400">
//                   {job.providerName}
//                 </p>

//               </div>

//               {/* SAVE BUTTON (prevent modal trigger) */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation(); // 🔥 VERY IMPORTANT
//                   toggleSave(job.id);
//                 }}
//                 className="text-slate-500"
//               >
//                 {savedJobs.includes(job.id)
//                   ? <BookmarkCheck className="text-purple-600" />
//                   : <Bookmark />}
//               </button>

//             </div>

//             {/* FOOTER */}
//             <div className="flex justify-between mt-4 text-sm text-slate-500">

//               <span>₹ {job.budget}</span>

//               <span className="flex items-center gap-1">
//                 <MapPin size={14} />
//                 {job.location}
//               </span>

//             </div>

//           </div>
//         ))}
//       </div>

//       {/* 🔥 APPLY MODAL */}
//       {selectedJob && (
//         <JobApplyModal
//           job={selectedJob}
//           onClose={() => setSelectedJob(null)}
//         />
//       )}

//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { getAllJobs } from "../../api/jobApi";
import {
  Search,
  MapPin,
  Bookmark,
  BookmarkCheck
} from "lucide-react";
import JobApplyModal from "../../components/JobApplyModal";
import toast from "react-hot-toast";

export default function SeekerJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [savedJobs, setSavedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // 🔥 PAGINATION STATE
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchJobs();
  }, [page, pageSize]);

  const fetchJobs = async () => {
    try {
      const res = await getAllJobs(page, pageSize);

      console.log("JOBS RESPONSE:", res.data);

      // ✅ FIX
      setJobs(res.data.data || []);
      setTotal(res.data.total || 0);

    } catch {
      toast.error("Failed to load jobs");
    }
  };

  // 🔥 CLIENT FILTER (on paginated data)
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase()) &&
    job.location.toLowerCase().includes(locationFilter.toLowerCase())
  );

  const toggleSave = (id) => {
    if (savedJobs.includes(id)) {
      setSavedJobs(savedJobs.filter((j) => j !== id));
    } else {
      setSavedJobs([...savedJobs, id]);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-5">

      {/* 🔍 SEARCH + FILTER */}
      <div className="flex gap-4">

        <div className="flex items-center bg-white border rounded-xl px-3 flex-1">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full p-2 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <input
          type="text"
          placeholder="Location"
          className="border rounded-xl px-3 py-2"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />

      </div>

      {/* 💼 JOB LIST */}
      <div className="grid gap-4">

        {filteredJobs.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            No jobs found
          </div>
        )}

        {filteredJobs.map((job) => (
          <div
            key={job.id}
            onClick={() => setSelectedJob(job)}
            className="p-5 bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex justify-between">

              <div className="space-y-2">

                <h3 className="text-lg font-semibold">{job.title}</h3>

                <p className="text-sm text-slate-500 line-clamp-2">
                  {job.description}
                </p>

                {job.skills && (
                  <div className="flex gap-2 flex-wrap">
                    {job.skills.split(",").map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-100 px-2 py-1 rounded-full"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-slate-400">
                  {job.providerName}
                </p>

              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSave(job.id);
                }}
                className="text-slate-500"
              >
                {savedJobs.includes(job.id)
                  ? <BookmarkCheck className="text-purple-600" />
                  : <Bookmark />}
              </button>

            </div>

            <div className="flex justify-between mt-4 text-sm text-slate-500">
              <span>₹ {job.budget}</span>

              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {job.location}
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* 🔥 PAGINATION UI */}
      <div className="flex justify-between items-center pt-6">

        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages || 1}
        </span>

        <button
          onClick={() =>
            setPage((p) => Math.min(p + 1, totalPages))
          }
          disabled={page === totalPages || totalPages === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>

        <select
          value={pageSize}
          onChange={(e) => {
            setPage(1);
            setPageSize(Number(e.target.value));
          }}
          className="ml-4 p-2 border rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>

      </div>

      {/* 🔥 APPLY MODAL */}
      {selectedJob && (
        <JobApplyModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}

    </div>
  );
}