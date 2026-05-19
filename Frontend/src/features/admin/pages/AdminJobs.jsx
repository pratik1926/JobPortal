
import { useEffect, useState } from "react";
import { getAllJobsAdmin } from "../../../api/adminApi";
import JobCard from "../../jobs/components/JobCard";
import JobDetailsModal from "../../jobs/components/JobDetailsModal";
import toast from "react-hot-toast";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // 🔥 pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const fetchJobs = async () => {
    try {
      const res = await getAllJobsAdmin(page, pageSize);

      console.log("JOBS PAGE:", res.data);

      const jobsArray = res.data?.data;

      if (!jobsArray) throw new Error("Invalid jobs response");

      setJobs(jobsArray);
      setTotal(res.data.total);

    } catch (err) {
      console.error("JOBS ERROR:", err);
      toast.error("Failed to load jobs");
    }
  };

  // 🔥 fetch when page changes
  useEffect(() => {
    fetchJobs();
  }, [page, pageSize]);

  // 🔥 calculate total pages
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">

      {/* 🔹 JOB LIST */}
      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs found</p>
      ) : (
        jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onClick={() => setSelectedJob(job)}
            clickable={true}
          />
        ))
      )}

      {/* 🔹 PAGINATION */}
      <div className="flex justify-between items-center mt-6">

        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>

        {/* 🔹 PAGE SIZE */}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1); // reset page
          }}
          className="ml-4 border p-1 rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>

      </div>

      {/* 🔹 MODAL */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          isAdmin={true}
        />
      )}

    </div>
  );
}