import { useEffect, useState } from "react";
import { getMyJobs, deleteJob } from "../../api/jobApi";
import PostJob from "./PostJob";
import EditJobModal from "./EditJobModal";
import { Trash2, Pencil } from "lucide-react";
import connection from "../../services/signalr";

export default function ProviderDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);

  // useEffect(() => {
  //   fetchJobs();
  // }, []);
  useEffect(() => {
  fetchJobs();

  // 🔥 SIGNALR CONNECTION
  connection.start()
    .then(() => {
      console.log("✅ SignalR Connected");
    })
    .catch((err) => {
      console.error("❌ SignalR Connection Error:", err);
    });

  // 🔔 LISTEN FOR NOTIFICATIONS
  connection.on("ReceiveNotification", (data) => {
    console.log("🔔 Notification:", data);

    alert(data.message); // temporary (we’ll replace with toast later)
  });

  // CLEANUP
  return () => {
    connection.off("ReceiveNotification");
  };

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