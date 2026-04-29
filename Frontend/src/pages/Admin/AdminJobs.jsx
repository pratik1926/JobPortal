
import { useEffect, useState } from "react";
import { getAllJobsAdmin } from "../../api/adminApi";
import JobCard from "../../components/JobCard";
import JobDetailsModal from "../../components/JobDetailsModal";
import toast from "react-hot-toast";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    try {
      const res = await getAllJobsAdmin();

      console.log("JOBS PAGE:", res.data); // 🔍 debug

      const jobsArray = Array.isArray(res.data)
        ? res.data
        : res.data?.data;

      if (!jobsArray) throw new Error("Invalid jobs response");

      setJobs(jobsArray);

    } catch (err) {
      console.error("JOBS ERROR:", err);
      toast.error("Failed to load jobs");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="space-y-4">

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