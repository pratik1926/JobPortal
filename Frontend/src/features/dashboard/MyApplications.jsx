import { useEffect, useState } from "react";
import { getMyApplications } from "../../api/jobApi";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      const res = await getMyApplications();
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "green";
      case "Rejected":
        return "red";
      default:
        return "orange";
    }
  };

  return (
    <div>
      <h2>My Applications</h2>

      {applications.length === 0 ? (
        <p>You have not applied to any jobs yet</p>
      ) : (
        applications.map(app => (
          <div
            key={app.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px"
            }}
          >
            <h3>{app.jobTitle}</h3>

            <p><strong>Location:</strong> {app.location}</p>

            <p>
              <strong>Status:</strong>{" "}
              <span style={{ color: getStatusColor(app.status), fontWeight: "bold" }}>
                {app.status}
              </span>
            </p>

            <p><strong>Applied On:</strong> {new Date(app.appliedAt).toLocaleString()}</p>

            {app.resumeUrl && (
              <a
                href={`https://localhost:7240${app.resumeUrl}`}
                target="_blank"
                rel="noreferrer"
              >
                View Resume
              </a>
            )}
          </div>
        ))
      )}
    </div>
  );
}