import { useEffect, useState } from "react";
import { getMyJobs } from "../../api/jobApi";
import PostJob from "./PostJob";

export default function ProviderDashboard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await getMyJobs();
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs", err);
    }
  };

  return (
    <div>
      <h3>Provider Dashboard</h3>

      {/* 🔥 Post Job */}
      <PostJob onJobCreated={fetchJobs} />

      <hr />

      {/* 🔥 My Jobs */}
      <h4>My Jobs</h4>

      {jobs.length === 0 ? (
  <p>No jobs yet</p>
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

      <p><strong>Description:</strong> {job.description}</p>

      <p><strong>Budget:</strong> ₹{job.budget}</p>

      <p><strong>Location:</strong> {job.location}</p>

      <p style={{ fontSize: "12px", color: "gray" }}>
        Created: {new Date(job.createdAt).toLocaleString()}
      </p>
    </div>
  ))
)}
    </div>
  );
}