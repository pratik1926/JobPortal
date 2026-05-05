import { useEffect, useState } from "react";
import { getMyJobs, deleteJob } from "../../api/jobApi";
import PostJob from "./PostJob";
import EditJobModal from "./EditJobModal";
import { Trash2, Pencil } from "lucide-react";
import connection from "../../services/signalr";
import BulkJobUpload from "../../components/BulkJobUpload"


export default function ProviderDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);

  // 🔥 PAGINATION STATE
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  // 🔥 FETCH JOBS
  const fetchJobs = async () => {
    try {
      const res = await getMyJobs(page, pageSize);

      const { data, total } = res.data;

      setJobs(data);
      setTotal(total);
    } catch (err) {
      console.error("Error fetching jobs", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 INITIAL + PAGINATION LOAD
  useEffect(() => {
    fetchJobs();
  }, [page, pageSize]);

  // 🔥 SIGNALR (ONLY ONCE)
  useEffect(() => {
    if (connection.state === "Disconnected") {
      connection.start()
        .then(() => console.log("✅ SignalR Connected"))
        .catch((err) =>
          console.error("❌ SignalR Connection Error:", err)
        );
    }

    const handleNotification = (data) => {
      console.log("🔔 Notification:", data);
      alert(data.message);

      // refresh current page
      fetchJobs();
    };

    connection.on("ReceiveNotification", handleNotification);

    return () => {
      connection.off("ReceiveNotification", handleNotification);
    };
  }, []);

  const totalPages = Math.ceil(total / pageSize);

  // 🔥 DELETE
  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      await deleteJob(jobId);

      // if last item deleted → go back a page
      if (jobs.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchJobs();
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // 🔥 UPDATE
  const handleUpdated = (updatedJob) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === updatedJob.id ? updatedJob : j))
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

      {/* 🔥 BULK JOB UPLOAD */}
      <BulkJobUpload />

      <h3 className="text-xl font-semibold mt-6">My Jobs</h3>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs posted yet</p>
      ) : (
        <div className="grid gap-5">
          {jobs.map((job) => (
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

              <p className="text-gray-600 mt-3">
                {job.description}
              </p>

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
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
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

      {/* EDIT MODAL */}
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