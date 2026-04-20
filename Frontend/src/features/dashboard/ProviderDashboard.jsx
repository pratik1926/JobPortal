import { useEffect, useState } from "react";
import { getMyJobs } from "../../api/jobApi";
import PostJob from "./PostJob";

export default function ProviderDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await getMyJobs();
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading jobs...</p>;
  }

  return (
    <div>
      <h2>Dashboard</h2>

      {/* 🔥 POST JOB */}
      <PostJob onJobCreated={fetchJobs} />

      <hr />

      {/* 🔥 JOB LIST */}
      <h3>My Jobs</h3>

      {jobs.length === 0 ? (
        <p>No jobs posted yet</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
              background: "#f9f9f9"
            }}
          >
            <h3>{job.title}</h3>

            <p>
              <strong>Description:</strong> {job.description}
            </p>

            <p>
              <strong>Budget:</strong> ₹{job.budget}
            </p>

            <p>
              <strong>Location:</strong> {job.location}
            </p>

            <p style={{ fontSize: "12px", color: "gray" }}>
              Created: {new Date(job.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}