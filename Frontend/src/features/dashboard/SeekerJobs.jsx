import { useEffect, useState } from "react";
import { getAllJobs, applyToJob, getMyApplications } from "../../api/jobApi";

export default function SeekerJobs() {

  const [jobs, setJobs] = useState([]);

  // ✅ store resume per jobId
  const [resumes, setResumes] = useState({});
  const [coverLetters, setCoverLetters] = useState({});
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, []);

  useEffect(() => {
  console.log("Applied Jobs:", appliedJobs);
}, [appliedJobs]);

  const fetchJobs = async () => {
    try {
      const res = await getAllJobs();
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppliedJobs = async () => {
  try {
    const res = await getMyApplications();
    setAppliedJobs(res.data);
  } catch (err) {
    console.error(err);
  }
};

  // ✅ handle file per job
  const handleFileChange = (jobId, file) => {
    setResumes((prev) => ({
      ...prev,
      [jobId]: file,
    }));
  };

  // ✅ handle cover letter per job
  const handleCoverLetterChange = (jobId, value) => {
    setCoverLetters((prev) => ({
      ...prev,
      [jobId]: value,
    }));
  };

  // ✅ updated apply function
  const handleApply = async (jobId) => {
  try {
    const resume = resumes[jobId];
    const coverLetter = coverLetters[jobId] || "";

    if (!resume) {
      alert("Please upload resume");
      return;
    }

    const formData = new FormData();
    formData.append("Resume", resume);
    formData.append("CoverLetter", coverLetter);

    await applyToJob(jobId, formData);

    // ✅ mark as applied
    setAppliedJobs((prev) => {
  if (prev.includes(jobId)) return prev; // prevent duplicates
  return [...prev, jobId];
});

    setTimeout(() => {
      alert("Applied successfully");
    }, 100);

    alert("Applied successfully");

  } catch (err) {
    console.error(err.response);
    alert(JSON.stringify(err.response?.data));
  }
};

  return (
    <div>
      <h3>Browse Jobs</h3>

      {jobs.length === 0 ? (
        <p>No jobs available</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px"
            }}
          >
            <h3>{job.title}</h3>

            <p>{job.description}</p>

            <p><strong>Budget:</strong> ₹{job.budget}</p>

            <p><strong>Location:</strong> {job.location}</p>

            {/* ✅ Resume Upload */}
            <input
              type="file"
              onChange={(e) =>
                handleFileChange(job.id, e.target.files[0])
              }
            />

            <br /><br />

            {/* ✅ Cover Letter */}
            <textarea
              placeholder="Cover Letter"
              value={coverLetters[job.id] || ""}
              onChange={(e) =>
                handleCoverLetterChange(job.id, e.target.value)
              }
            />

            <br /><br />

             {/* ✅ SMART APPLY BUTTON */}
            {appliedJobs.includes(Number(job.id)) ? (
              <button disabled style={{ background: "gray", color: "white" }}>
                Applied
              </button>
            ) : (
              <button
                onClick={() => handleApply(job.id)}
                disabled={!resumes[job.id]} // 🔥 disabled until resume uploaded
              >
                Apply
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}